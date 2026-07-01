import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { TicketsModule } from '../tickets/tickets.module';
import { OrdersModule } from './orders.module';
import { OrdersService } from './orders.service';
import { TicketsService } from '../tickets/tickets.service';

describe('OrdersService (Payment Idempotency Integration Test)', () => {
  let ordersService: OrdersService;
  let ticketsService: TicketsService;
  let databaseService: DatabaseService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
        TicketsModule,
        OrdersModule,
      ],
    }).compile();

    ordersService = moduleRef.get<OrdersService>(OrdersService);
    ticketsService = moduleRef.get<TicketsService>(TicketsService);
    databaseService = moduleRef.get<DatabaseService>(DatabaseService);
    await moduleRef.init();
  });

  afterAll(async () => {
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  beforeEach(async () => {
    // Reset bảng orders và tickets về trạng thái trống/sẵn sàng trước mỗi test case
    await ordersService.resetAllOrders();
    await ticketsService.resetAllTickets();
  });

  it('should process payment successfully for a held ticket', async () => {
    const REGULAR_TICKET_TYPE = 1;
    const userId = 'test_user_pay';
    const amount = 500000;

    // 1. Giữ vé trước
    const holdResult = await ticketsService.holdTicket(
      REGULAR_TICKET_TYPE,
      userId,
    );
    expect(holdResult.ticketId).toBeDefined();

    // 2. Tiến hành thanh toán
    const order = await ordersService.processPayment(
      holdResult.ticketId,
      userId,
      amount,
    );

    expect(order).toBeDefined();
    expect(order.status).toBe('PAID');
    expect(Number(order.amount)).toBe(amount);
    expect(order.ticket_id).toBe(holdResult.ticketId);
    expect(order.user_id).toBe(userId);

    // 3. Kiểm tra trạng thái vé trong DB đã chuyển thành SOLD
    const ticketsCountHeld = await ticketsService.getTicketsCount(
      REGULAR_TICKET_TYPE,
      'HELD',
    );
    const ticketsCountSold = await ticketsService.getTicketsCount(
      REGULAR_TICKET_TYPE,
      'SOLD',
    );
    expect(ticketsCountHeld).toBe(0);
    expect(ticketsCountSold).toBe(1);
  });

  it('should return existing order when payment request is retried (idempotency)', async () => {
    const REGULAR_TICKET_TYPE = 1;
    const userId = 'test_user_idempotent';
    const amount = 500000;

    // 1. Giữ vé trước
    const holdResult = await ticketsService.holdTicket(
      REGULAR_TICKET_TYPE,
      userId,
    );
    const ticketId = holdResult.ticketId;

    // 2. Gửi đồng thời 2 request thanh toán (Promise.all) cho cùng một vé để giả lập click đúp
    console.log(
      `Sending 2 concurrent payment requests for ticket ${ticketId}...`,
    );
    const paymentPromises = [
      ordersService.processPayment(ticketId, userId, amount),
      ordersService.processPayment(ticketId, userId, amount),
    ];

    const results = await Promise.allSettled(paymentPromises);
    console.log('Concurrent payment requests finished.');

    // 3. Xác minh cả hai requests đều thành công (không bị crash hay ném lỗi SOLD)
    const successfulPayments = results.filter(
      (r) => r.status === 'fulfilled',
    ) as PromiseFulfilledResult<{
      id: number;
      ticket_id: number;
      status: string;
      amount: number;
      user_id: string;
    }>[];

    expect(successfulPayments.length).toBe(2);

    const order1 = successfulPayments[0].value;
    const order2 = successfulPayments[1].value;

    // 4. Xác minh cả hai phản hồi đều trả về cùng một thông tin đơn hàng (cùng ID và trạng thái PAID)
    expect(order1.id).toBe(order2.id);
    expect(order1.status).toBe('PAID');
    expect(order2.status).toBe('PAID');
    expect(order1.ticket_id).toBe(ticketId);
    expect(order2.ticket_id).toBe(ticketId);

    // 5. Kiểm tra thực tế trong DB: Bảng orders chỉ được chứa duy nhất 1 hàng tương ứng với vé này
    const dbOrders = await databaseService.query<{ count: number }>(
      `SELECT COUNT(*)::int as count FROM orders WHERE ticket_id = $1`,
      [ticketId],
    );
    expect(dbOrders.rows[0].count).toBe(1);
  });
});
