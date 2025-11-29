import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './payment.controller';
import { VNPayService } from './vnpay.service';
import { MomoService } from './momo.service';
import { CodService } from './cod.service';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
            { name: Order.name, schema: OrderSchema },
        ]),
        OrdersModule,
    ],
    controllers: [PaymentController],
    providers: [VNPayService, MomoService, CodService],
    exports: [VNPayService, MomoService, CodService],
})
export class PaymentModule { }
