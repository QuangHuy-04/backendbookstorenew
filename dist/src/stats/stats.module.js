"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const stats_controller_1 = require("./stats.controller");
const book_schema_1 = require("../books/schemas/book.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
let StatsModule = class StatsModule {
};
exports.StatsModule = StatsModule;
exports.StatsModule = StatsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: book_schema_1.Book.name, schema: book_schema_1.BookSchema },
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
            ]),
        ],
        controllers: [stats_controller_1.StatsController],
    })
], StatsModule);
//# sourceMappingURL=stats.module.js.map