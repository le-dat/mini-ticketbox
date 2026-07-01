import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class TicketsGateway {
  private readonly logger = new Logger(TicketsGateway.name);

  @WebSocketServer()
  server: Server;

  broadcastCountUpdate() {
    this.logger.log('Broadcasting ticket count update event to all clients...');
    if (this.server) {
      this.server.emit('ticket_count_update');
    } else {
      this.logger.warn('WebSocket server is not initialized yet.');
    }
  }
}
