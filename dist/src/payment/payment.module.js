"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payment_controller_1 = require("./payment.controller");
const vnpay_service_1 = require("./vnpay.service");
const momo_service_1 = require("./momo.service");
const cod_service_1 = require("./cod.service");
const transaction_schema_1 = require("./schemas/transaction.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
const orders_module_1 = require("../orders/orders.module");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
            ]),
            orders_module_1.OrdersModule,
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [vnpay_service_1.VNPayService, momo_service_1.MomoService, cod_service_1.CodService],
        exports: [vnpay_service_1.VNPayService, momo_service_1.MomoService, cod_service_1.CodService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map