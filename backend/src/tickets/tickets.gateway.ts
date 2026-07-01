import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@WebSocketGateway({ cors: true })
export class TicketsGateway {
  private readonly logger = new Logger(TicketsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => TicketsService))
    private readonly ticketsService: TicketsService,
  ) {}

  async broadcastCountUpdate() {
    this.logger.log('Broadcasting ticket count update event to all clients...');
    if (this.server) {
      try {
        const regularCount = await this.ticketsService.getTicketsCount(
          1,
          'AVAILABLE',
        );
        const vipCount = await this.ticketsService.getTicketsCount(
          2,
          'AVAILABLE',
        );

        // Emit type-specific events
        this.server.emit('ticket_count_updated:1', {
          availableCount: regularCount,
        });
        this.server.emit('ticket_count_updated:2', {
          availableCount: vipCount,
        });

        // General event fallback
        this.server.emit('ticket_count_update', {
          counts: {
            1: regularCount,
            2: vipCount,
          },
        });
      } catch (err) {
        const error = err as Error;
        this.logger.error(`Failed to broadcast count update: ${error.message}`);
      }
    } else {
      this.logger.warn('WebSocket server is not initialized yet.');
    }
  }
}
