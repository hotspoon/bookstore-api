import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CustomersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCustomerDto: Prisma.CustomerCreateInput) {
    return this.databaseService.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll() {
    return this.databaseService.customer.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.customer.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCustomerDto: Prisma.CustomerUpdateInput) {
    return this.databaseService.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.customer.delete({
      where: { id },
    });
  }
}
