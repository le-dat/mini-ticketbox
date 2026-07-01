import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('api/ticket-types')
export class TicketTypesController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async getTicketTypes() {
    return this.ticketsService.getTicketTypes();
  }

  @Get(':id/available')
  async getAvailableCount(@Param('id', ParseIntPipe) id: number) {
    const count = await this.ticketsService.getTicketsCount(id, 'AVAILABLE');
    return { availableCount: count };
  }
}
