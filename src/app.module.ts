import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [CustomersModule, DatabaseModule, BooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
