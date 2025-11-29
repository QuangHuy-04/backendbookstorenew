import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { StatsModule } from './stats/stats.module';
import { MailModule } from './mail/mail.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore'),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    BooksModule,
    CategoriesModule,
    UsersModule,
    OrdersModule,
    PaymentModule,
    StatsModule,
    PromoCodesModule,
    ReviewsModule,
  ],
})
export class AppModule { }
