"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const books_module_1 = require("./books/books.module");
const categories_module_1 = require("./categories/categories.module");
const users_module_1 = require("./users/users.module");
const orders_module_1 = require("./orders/orders.module");
const payment_module_1 = require("./payment/payment.module");
const stats_module_1 = require("./stats/stats.module");
const promo_codes_module_1 = require("./promo-codes/promo-codes.module");
const reviews_module_1 = require("./reviews/reviews.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore'),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            auth_module_1.AuthModule,
            books_module_1.BooksModule,
            categories_module_1.CategoriesModule,
            users_module_1.UsersModule,
            orders_module_1.OrdersModule,
            payment_module_1.PaymentModule,
            stats_module_1.StatsModule,
            promo_codes_module_1.PromoCodesModule,
            reviews_module_1.ReviewsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map