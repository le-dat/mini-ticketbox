import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { TicketsModule } from './tickets.module';
import { TicketsService } from './tickets.service';
import { ConflictException } from '@nestjs/common';

describe('TicketsService (Concurrency Integration Test)', () => {
  let ticketsService: TicketsService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
        TicketsModule,
      ],
    }).compile();

    ticketsService = moduleRef.get<TicketsService>(TicketsService);
    await moduleRef.init();
  });

  afterAll(async () => {
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  beforeEach(async () => {
    // Reset database trạng thái vé về AVAILABLE trước mỗi test case
    await ticketsService.resetAllTickets();
  });

  it('should hold exactly 200 VIP tickets when 600 concurrent requests arrive', async () => {
    const VIP_TICKET_TYPE_ID = 2; // VIP có 200 vé
    const totalRequests = 600;

    // Tạo 600 requests giữ vé đồng thời với các user_id khác nhau
    const holdPromises = Array.from({ length: totalRequests }).map((_, index) => {
      const userId = `user_concurrent_${index + 1}`;
      return ticketsService.holdTicket(VIP_TICKET_TYPE_ID, userId);
    });

    // Chạy đồng thời 600 promises
    this.logger = console; // Hỗ trợ in kết quả debug nếu cần
    console.log(`Starting ${totalRequests} concurrent hold ticket requests...`);
    const results = await Promise.allSettled(holdPromises);
    console.log(`Completed all concurrent requests.`);

    // Lọc ra các requests thành công và thất bại
    const successfulHolds = results.filter(
      (r) => r.status === 'fulfilled',
    ) as PromiseFulfilledResult<{ ticketId: number; expiresAt: Date }>[];

    const failedHolds = results.filter(
      (r) => r.status === 'rejected',
    ) as PromiseRejectedResult[];

    // Kiểm chứng kết quả
    expect(successfulHolds.length).toBe(200);
    expect(failedHolds.length).toBe(400);

    // Xác minh tất cả các lỗi thất bại đều là ConflictException (SOLD_OUT)
    failedHolds.forEach((f) => {
      expect(f.reason).toBeInstanceOf(ConflictException);
      const response = (f.reason as ConflictException).getResponse() as any;
      expect(response.code).toBe('SOLD_OUT');
    });

    // Xác minh 200 vé giữ thành công có các ticketId duy nhất (không trùng lặp)
    const ticketIds = successfulHolds.map((h) => h.value.ticketId);
    const uniqueTicketIds = new Set(ticketIds);
    expect(uniqueTicketIds.size).toBe(200);

    // Truy vấn database để đếm số lượng vé HELD và AVAILABLE thực tế trong DB
    const heldCount = await ticketsService.getTicketsCount(VIP_TICKET_TYPE_ID, 'HELD');
    const availableCount = await ticketsService.getTicketsCount(VIP_TICKET_TYPE_ID, 'AVAILABLE');

    expect(heldCount).toBe(200);
    expect(availableCount).toBe(0);
  });
});
