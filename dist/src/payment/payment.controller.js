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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const vnpay_service_1 = require("./vnpay.service");
const momo_service_1 = require("./momo.service");
const cod_service_1 = require("./cod.service");
let PaymentController = class PaymentController {
    vnpayService;
    momoService;
    codService;
    constructor(vnpayService, momoService, codService) {
        this.vnpayService = vnpayService;
        this.momoService = momoService;
        this.codService = codService;
    }
    createVNPayPayment(body) {
        const paymentUrl = this.vnpayService.createPaymentUrl(body.orderId, body.amount, body.returnUrl);
        return { paymentUrl };
    }
    async vnpayReturn(query) {
        const isValid = await this.vnpayService.verifyReturnUrl(query);
        if (!isValid) {
            return { success: false, message: 'Invalid signature' };
        }
        const responseCode = query['vnp_ResponseCode'];
        return {
            success: responseCode === '00',
            message: responseCode === '00' ? 'Payment successful' : 'Payment failed',
            transactionId: query['vnp_TransactionNo'] || query['vnp_TxnRef'],
        };
    }
    async vnpayIPN(query) {
        return await this.vnpayService.handleIPN(query);
    }
    async createMomoPayment(body) {
        return await this.momoService.createPayment(body.orderId, body.amount, body.returnUrl, body.ipnUrl);
    }
    async momoCallback(body) {
        return await this.momoService.handleCallback(body);
    }
    async createCodOrder(orderData) {
        return this.codService.createCodOrder(orderData);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('vnpay/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "createVNPayPayment", null);
__decorate([
    (0, common_1.Get)('vnpay/return'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "vnpayReturn", null);
__decorate([
    (0, common_1.Post)('vnpay/ipn'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "vnpayIPN", null);
__decorate([
    (0, common_1.Post)('momo/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createMomoPayment", null);
__decorate([
    (0, common_1.Post)('momo/callback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "momoCallback", null);
__decorate([
    (0, common_1.Post)('cod'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createCodOrder", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [vnpay_service_1.VNPayService,
        momo_service_1.MomoService,
        cod_service_1.CodService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map