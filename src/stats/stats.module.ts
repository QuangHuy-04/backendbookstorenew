import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { Book, BookSchema } from '../books/schemas/book.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Book.name, schema: BookSchema },
            { name: Order.name, schema: OrderSchema },
        ]),
    ],
    controllers: [StatsController],
})
export class StatsModule { }
