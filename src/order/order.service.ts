import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { NotFoundException } from '@nestjs/common';

export type OrderCreateInput = {
  customerId: number;
  bookId: number;
};

@Injectable()
export class OrderService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createOrderDto: OrderCreateInput) {
    if (!createOrderDto.customerId || !createOrderDto.bookId) {
      throw new Error(
        JSON.stringify({
          error: 'MissingData',
          message: 'Both customerId and bookId must be provided.',
        }),
      );
    }

    const book = await this.databaseService.book.findUnique({
      where: { id: createOrderDto.bookId },
    });

    if (!book) {
      throw new Error(
        JSON.stringify({
          error: 'BookNotFound',
          message: 'No book found with the provided bookId.',
        }),
      );
    }

    const existingOrder = await this.databaseService.order.findFirst({
      where: {
        customerId: createOrderDto.customerId,
        bookId: createOrderDto.bookId,
      },
    });

    if (existingOrder) {
      throw new Error(
        JSON.stringify({
          error: 'OrderExists',
          message:
            'An active order for this book already exists for this customer.',
        }),
      );
    }

    await this.databaseService.order.create({
      data: createOrderDto,
    });

    return { message: 'Order created successfully.' };
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
    return this.databaseService.order.delete({
      where: { id },
    });
  }

  async updateOrder(id: number) {
    const order = await this.databaseService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.databaseService.order.update({
      where: { id },
      data: { cancelled: false },
    });
  }

  async cancel(id: number) {
    const order = await this.databaseService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

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
