import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';
import { TicketsGateway } from './tickets.gateway';

@Injectable()
export class ReleaseExpiredHoldsCron {
  private readonly logger = new Logger(ReleaseExpiredHoldsCron.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly ticketsGateway: TicketsGateway,
  ) {}

  @Cron('*/30 * * * * *')
  async releaseExpiredHolds() {
    const query = `
      UPDATE tickets
      SET
        status          = 'AVAILABLE',
        user_id         = NULL,
        hold_expires_at = NULL,
        held_at         = NULL
      WHERE status = 'HELD'
        AND hold_expires_at < NOW();
    `;

    try {
      const result = await this.db.query(query);
      if (result.rowCount && result.rowCount > 0) {
        this.logger.log(
          `Đã tự động giải phóng ${result.rowCount} vé giữ hết hạn.`,
        );
        // Emit sự kiện WebSocket cập nhật lại số lượng vé
        await this.ticketsGateway.broadcastCountUpdate();
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Lỗi khi giải phóng vé giữ hết hạn: ${err.message}`,
        err.stack,
      );
    }
  }
}
