import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async processPayment(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.processPayment(
      createOrderDto.ticket_id,
      createOrderDto.user_id,
      createOrderDto.amount,
    );
  }

  @Get('stats')
  async getAdminStats() {
    return this.ordersService.getAdminStats();
  }
}
