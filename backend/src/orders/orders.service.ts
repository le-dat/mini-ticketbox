import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TicketsGateway } from '../tickets/tickets.gateway';
import { TicketsService } from '../tickets/tickets.service';

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
    private readonly ticketsService: TicketsService,
  ) {}

  /**
   * Process payment and update ticket status inside a Database Transaction.
   * Supports idempotency handling under high concurrent loads.
   */
  async processPayment(
    ticketId: number,
    userId: string,
    amount: number,
  ): Promise<Order> {
    // 1. SEQUENTIAL IDEMPOTENCY CHECK: Check if the order was already paid successfully
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

    // Get client from Pool to execute manual Database Transaction
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      // 2. Retrieve ticket info with FOR UPDATE lock to avoid race conditions
      const ticketResult = await client.query<TicketRow>(
        `SELECT * FROM tickets WHERE id = $1 AND user_id = $2 FOR UPDATE`,
        [ticketId, userId],
      );

      const ticket = ticketResult.rows[0];
      if (!ticket) {
        throw new BadRequestException(
          'Ticket does not exist or does not belong to this user.',
        );
      }

      // Concurrency Idempotency handler when ticket is already SOLD
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
        throw new BadRequestException('Ticket has already been paid and sold.');
      }

      // Check HELD status and hold expiration time
      if (
        ticket.status !== 'HELD' ||
        !ticket.hold_expires_at ||
        new Date(ticket.hold_expires_at) < new Date()
      ) {
        throw new BadRequestException(
          'Ticket hold has expired or ticket is not held.',
        );
      }

      // 3. Update ticket status to SOLD
      await client.query(
        `UPDATE tickets 
         SET status = 'SOLD', sold_at = NOW() 
         WHERE id = $1`,
        [ticketId],
      );

      // 4. Create or update successful paid order
      const txOrderResult = await client.query<Order>(
        `SELECT * FROM orders WHERE ticket_id = $1 AND user_id = $2`,
        [ticketId, userId],
      );

      let order: Order;
      if (txOrderResult.rows.length > 0) {
        // Update old PENDING order to PAID
        const updateOrderResult = await client.query<Order>(
          `UPDATE orders 
           SET status = 'PAID', amount = $1 
           WHERE id = $2 RETURNING *`,
          [amount, txOrderResult.rows[0].id],
        );
        order = updateOrderResult.rows[0];
      } else {
        // Create new PAID order
        const insertOrderResult = await client.query<Order>(
          `INSERT INTO orders (ticket_id, user_id, status, amount) 
           VALUES ($1, $2, 'PAID', $3) RETURNING *`,
          [ticketId, userId, amount],
        );
        order = insertOrderResult.rows[0];
      }

      await client.query('COMMIT');

      // Broadcast WebSocket event about ticket count updates
      await this.ticketsGateway.broadcastCountUpdate();

      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Reset orders table for test suite database cleanup purposes
   */
  async resetAllOrders(): Promise<void> {
    await this.db.query('DELETE FROM orders;');
    this.logger.log('All orders deleted from database');
  }

  /**
   * Compute total revenue, total tickets sold, and list currently held tickets
   */
  async getAdminStats() {
    const queryStats = `
      SELECT 
        COALESCE(COUNT(*), 0)::int as total_sold,
        COALESCE(SUM(amount), 0)::float as total_revenue
      FROM orders
      WHERE status = 'PAID';
    `;
    const statsResult = await this.db.query<{
      total_sold: number;
      total_revenue: number;
    }>(queryStats);
    const { total_sold, total_revenue } = statsResult.rows[0];

    const vipHeld = await this.ticketsService.getTicketsCount(2, 'HELD');
    const regularHeld = await this.ticketsService.getTicketsCount(1, 'HELD');
    const total_held = vipHeld + regularHeld;

    const heldTickets = await this.ticketsService.getHeldTickets();

    return {
      total_sold,
      total_revenue,
      total_held,
      heldTickets,
    };
  }
}
