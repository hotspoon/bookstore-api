import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrderService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createOrderDto: Prisma.OrderCreateInput) {
    return this.databaseService.order.create({
      data: createOrderDto,
    });
  }

  findAll() {
    return this.databaseService.order.findMany();
  }

  findOne(id: number) {
    return this.databaseService.order.findUnique({
      where: { id },
    });
  }

  update(id: number, updateOrderDto: Prisma.OrderUpdateInput) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  cancel(id: number) {
    return this.databaseService.order.update({
      where: { id },
      data: { cancelled: true },
    });
  }
  // async update(id: number, updateCustomerDto: Prisma.CustomerUpdateInput) {
  //   return this.databaseService.customer.update({
  //     where: { id },
  //     data: updateCustomerDto,
  //   });
  // }
}
