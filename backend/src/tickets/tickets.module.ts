import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TicketsGateway } from './tickets.gateway';
import { ReleaseExpiredHoldsCron } from './release-expired-holds.cron';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TicketsController],
  providers: [TicketsService, TicketsGateway, ReleaseExpiredHoldsCron],
  exports: [TicketsService, TicketsGateway],
})
export class TicketsModule {}
