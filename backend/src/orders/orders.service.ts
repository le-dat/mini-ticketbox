import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TicketsGateway } from '../tickets/tickets.gateway';

export interface Order {
  id: number;
  ticket_id: number;
  user_id: string;
  status: string;
  amount: number;
  created_at: Date;
}

interface TicketRow {
  id: number;
  ticket_type_id: number;
  status: string;
  user_id: string | null;
  held_at: Date | null;
  hold_expires_at: Date | null;
  sold_at: Date | null;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly ticketsGateway: TicketsGateway,
  ) {}

  /**
   * Thực hiện thanh toán và cập nhật trạng thái vé trong Database Transaction
   * Có hỗ trợ xử lý Idempotency (chống trùng lặp) dưới tải cao
   */
  async processPayment(
    ticketId: number,
    userId: string,
    amount: number,
  ): Promise<Order> {
    // 1. KIỂM TRA IDEMPOTENCY TUẦN TỰ: Xem order đã được thanh toán thành công trước đó chưa
    const existingOrder = await this.db.query<Order>(
      `SELECT * FROM orders WHERE ticket_id = $1 AND user_id = $2`,
      [ticketId, userId],
    );

    if (existingOrder.rows.length > 0) {
      if (existingOrder.rows[0].status === 'PAID') {
        this.logger.log(
          `Idempotency hit (sequential): Order ${existingOrder.rows[0].id} already PAID. Returning existing order.`,
        );
        return existingOrder.rows[0];
      }
    }

    // Lấy client từ Pool để thực thi Transaction thủ công
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      // 2. Lấy thông tin vé kèm lock FOR UPDATE để tránh race condition
      const ticketResult = await client.query<TicketRow>(
        `SELECT * FROM tickets WHERE id = $1 AND user_id = $2 FOR UPDATE`,
        [ticketId, userId],
      );

      const ticket = ticketResult.rows[0];
      if (!ticket) {
        throw new BadRequestException(
          'Vé không tồn tại hoặc không thuộc về người dùng này.',
        );
      }

      // Xử lý khi vé đã SOLD (Cơ chế Concurrency Idempotency)
      if (ticket.status === 'SOLD') {
        const orderResult = await client.query<Order>(
          `SELECT * FROM orders WHERE ticket_id = $1 AND user_id = $2`,
          [ticketId, userId],
        );
        if (
          orderResult.rows.length > 0 &&
          orderResult.rows[0].status === 'PAID'
        ) {
          this.logger.log(
            `Idempotency hit (concurrency): Ticket ${ticketId} is SOLD and Order ${orderResult.rows[0].id} is PAID. Returning existing order.`,
          );
          await client.query('COMMIT');
          return orderResult.rows[0];
        }
        throw new BadRequestException(
          'Vé đã được thanh toán và bán thành công.',
        );
      }

      // Kiểm tra trạng thái HELD và thời gian giữ vé
      if (
        ticket.status !== 'HELD' ||
        !ticket.hold_expires_at ||
        new Date(ticket.hold_expires_at) < new Date()
      ) {
        throw new BadRequestException(
          'Thời gian giữ vé đã hết hạn hoặc vé chưa được giữ, không thể thanh toán.',
        );
      }

      // 3. Cập nhật trạng thái vé thành SOLD
      await client.query(
        `UPDATE tickets 
         SET status = 'SOLD', sold_at = NOW() 
         WHERE id = $1`,
        [ticketId],
      );

      // 4. Tạo mới hoặc cập nhật đơn hàng thành công
      const txOrderResult = await client.query<Order>(
        `SELECT * FROM orders WHERE ticket_id = $1 AND user_id = $2`,
        [ticketId, userId],
      );

      let order: Order;
      if (txOrderResult.rows.length > 0) {
        // Cập nhật order PENDING cũ thành PAID
        const updateOrderResult = await client.query<Order>(
          `UPDATE orders 
           SET status = 'PAID', amount = $1 
           WHERE id = $2 RETURNING *`,
          [amount, txOrderResult.rows[0].id],
        );
        order = updateOrderResult.rows[0];
      } else {
        // Tạo mới order trạng thái PAID
        const insertOrderResult = await client.query<Order>(
          `INSERT INTO orders (ticket_id, user_id, status, amount) 
           VALUES ($1, $2, 'PAID', $3) RETURNING *`,
          [ticketId, userId, amount],
        );
        order = insertOrderResult.rows[0];
      }

      await client.query('COMMIT');

      // Phát sự kiện WebSocket thông báo thay đổi số lượng vé trống
      this.ticketsGateway.broadcastCountUpdate();

      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Reset bảng orders phục vụ cho việc kiểm thử tích hợp dọn dẹp dữ liệu
   */
  async resetAllOrders(): Promise<void> {
    await this.db.query('DELETE FROM orders;');
    this.logger.log('All orders deleted from database');
  }
}
