"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const reviews_controller_1 = require("./reviews.controller");
const reviews_service_1 = require("./reviews.service");
const review_schema_1 = require("./schemas/review.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
const book_schema_1 = require("../books/schemas/book.schema");
let ReviewsModule = class ReviewsModule {
};
exports.ReviewsModule = ReviewsModule;
exports.ReviewsModule = ReviewsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema },
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
                { name: book_schema_1.Book.name, schema: book_schema_1.BookSchema },
            ]),
        ],
        controllers: [reviews_controller_1.ReviewsController],
        providers: [reviews_service_1.ReviewsService],
        exports: [reviews_service_1.ReviewsService],
    })
], ReviewsModule);
//# sourceMappingURL=reviews.module.js.map