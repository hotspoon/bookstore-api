import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './books/books.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CustomersModule, DatabaseModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
