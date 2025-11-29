"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VNPayService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto = __importStar(require("crypto"));
const transaction_schema_1 = require("./schemas/transaction.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
let VNPayService = class VNPayService {
    transactionModel;
    orderModel;
    tmnCode = process.env.VNPAY_TMN_CODE || '';
    secretKey = process.env.VNPAY_SECRET_KEY || '';
    vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    constructor(transactionModel, orderModel) {
        this.transactionModel = transactionModel;
        this.orderModel = orderModel;
    }
    createPaymentUrl(orderId, amount, returnUrl) {
        const createDate = this.formatDate(new Date());
        const orderId_vnp = `${orderId}_${Date.now()}`;
        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.tmnCode,
            vnp_Amount: (amount * 100).toString(),
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: '127.0.0.1',
            vnp_Locale: 'vn',
            vnp_OrderInfo: `BookStore Order ${orderId}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: returnUrl,
            vnp_TxnRef: orderId_vnp,
        };
        const sortedParams = this.sortObject(vnpParams);
        const signData = new URLSearchParams(sortedParams).toString();
        const hmac = crypto.createHmac('sha512', this.secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        sortedParams['vnp_SecureHash'] = signed;
        const finalUrl = `${this.vnpUrl}?${new URLSearchParams(sortedParams).toString()}`;
        return finalUrl;
    }
    async verifyReturnUrl(params) {
        const secureHash = params['vnp_SecureHash'];
        delete params['vnp_SecureHash'];
        delete params['vnp_SecureHashType'];
        const sortedParams = this.sortObject(params);
        const signData = new URLSearchParams(sortedParams).toString();
        const hmac = crypto.createHmac('sha512', this.secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        return secureHash === signed;
    }
    async handleIPN(params) {
        try {
            const isValid = await this.verifyReturnUrl(params);
            if (!isValid) {
                return { RspCode: '97', Message: 'Invalid signature' };
            }
            const orderId = params['vnp_TxnRef'].split('_')[0];
            const amount = parseFloat(params['vnp_Amount']) / 100;
            const responseCode = params['vnp_ResponseCode'];
            const transaction = new this.transactionModel({
                order: orderId,
                provider: 'vnpay',
                transactionId: params['vnp_TransactionNo'] || params['vnp_TxnRef'],
                amount,
                status: responseCode === '00' ? 'success' : 'failed',
                rawResponse: params,
            });
            await transaction.save();
            if (responseCode === '00') {
                await this.orderModel.findByIdAndUpdate(orderId, {
                    status: 'paid',
                    transactionId: params['vnp_TransactionNo'] || params['vnp_TxnRef'],
                    paidAt: new Date(),
                });
                return { RspCode: '00', Message: 'Success' };
            }
            return { RspCode: responseCode, Message: 'Payment failed' };
        }
        catch (error) {
            console.error('VNPay IPN error:', error);
            return { RspCode: '99', Message: 'Unknown error' };
        }
    }
    sortObject(obj) {
        const sorted = {};
        const keys = Object.keys(obj).sort();
        keys.forEach((key) => {
            sorted[key] = obj[key];
        });
        return sorted;
    }
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
};
exports.VNPayService = VNPayService;
exports.VNPayService = VNPayService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], VNPayService);
//# sourceMappingURL=vnpay.service.js.map