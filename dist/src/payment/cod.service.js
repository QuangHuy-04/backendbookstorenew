"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodService = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../orders/orders.service");
let CodService = class CodService {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async createCodOrder(orderData) {
        const order = await this.ordersService.create({
            items: orderData.items,
            shippingAddress: orderData.shippingAddress,
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            tax: orderData.tax,
            total: orderData.total,
            discount: orderData.discount || 0,
            promoCode: orderData.promoCode,
            paymentMethod: 'cod',
            status: 'pending',
        }, orderData.userId);
        return {
            success: true,
            orderId: order._id,
            message: 'Order placed successfully. Please pay upon delivery.',
            order: {
                id: order._id,
                total: order.total,
                paymentMethod: 'COD',
                estimatedDelivery: this.calculateDeliveryDate(),
            },
        };
    }
    calculateDeliveryDate() {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        return deliveryDate.toISOString().split('T')[0];
    }
};
exports.CodService = CodService;
exports.CodService = CodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], CodService);
//# sourceMappingURL=cod.service.js.map