import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrderCreateInput, OrderService } from './order.service';
import { Prisma } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: OrderCreateInput) {
    try {
      return await this.orderService.create(createOrderDto);
    } catch (error) {
      const { message } = error;
      const { error: errorCode, message: errorMessage } = JSON.parse(message);
      throw new HttpException(
        { errorCode, errorMessage },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: Prisma.OrderUpdateInput,
  ) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.orderService.cancel(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
