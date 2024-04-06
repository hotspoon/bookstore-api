import { Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBookDto: Prisma.BookCreateInput) {
    return this.databaseService.book.create({
      data: createBookDto,
    });
  }

  async createMultiple(
    createBookDtos: Prisma.BookCreateInput[],
  ): Promise<Book[]> {
    const books = await Promise.all(
      createBookDtos.map((dto) =>
        this.databaseService.book.create({ data: dto }),
      ),
    );
    return books;
  }

  async findAll() {
    return this.databaseService.book.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.book.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateBookDto: Prisma.BookUpdateInput) {
    return this.databaseService.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.book.delete({
      where: { id },
    });
  }
}
