import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { HoldTicketDto } from './dto/hold-ticket.dto';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('hold')
  @HttpCode(HttpStatus.OK)
  async holdTicket(@Body() holdTicketDto: HoldTicketDto) {
    return this.ticketsService.holdTicket(
      holdTicketDto.ticket_type_id,
      holdTicketDto.user_id,
    );
  }
}
