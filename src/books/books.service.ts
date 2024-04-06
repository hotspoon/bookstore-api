import { Injectable } from '@nestjs/common';
import { Book, Prisma, Tag } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

interface PaginateQuery {
  page: string;
  limit: string;
}

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBookDto: Prisma.BookCreateInput): Promise<Book> {
    const { tags, ...bookData } = createBookDto;

    let resolvedTags = [];

    if (tags && Array.isArray(tags.create)) {
      const tagPromises = tags.create.map(async (tag: Tag) => {
        const existingTag = await this.databaseService.tag.findUnique({
          where: { name: tag.name },
        });

        if (existingTag) {
          return {
            where: { id: existingTag.id },
            create: { name: tag.name },
          };
        } else {
          return {
            where: { name: tag.name },
            create: { name: tag.name },
          };
        }
      });

      resolvedTags = await Promise.all(tagPromises);
    }

    return this.databaseService.book.create({
      data: {
        ...bookData,
        tags: {
          connectOrCreate: resolvedTags,
        },
      },
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

  async findAll(query: PaginateQuery) {
    const page = parseInt(query.page, 10);
    const limit = parseInt(query.limit, 10);

    const totalItems = await this.databaseService.book.count();
    const books = await this.databaseService.book.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        tags: true,
        orders: true, // Fetch related orders
      },
    });

    const items = books.map((book) => ({
      ...book,
      tags: book.tags.map((tag) => tag.name),
      orders: book.orders.map((order) => ({
        id: order.id,
        customerId: order.customerId,
        createdAt: order.createdAt,
        cancelled: order.cancelled,
      })),
    }));

    return {
      items,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
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
