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
exports.MomoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto = __importStar(require("crypto"));
const transaction_schema_1 = require("./schemas/transaction.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
let MomoService = class MomoService {
    transactionModel;
    orderModel;
    partnerCode;
    accessKey;
    secretKey;
    endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';
    constructor(transactionModel, orderModel) {
        this.transactionModel = transactionModel;
        this.orderModel = orderModel;
        this.partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO_PARTNER_CODE';
        this.accessKey = process.env.MOMO_ACCESS_KEY || 'MOMO_ACCESS_KEY';
        this.secretKey = process.env.MOMO_SECRET_KEY || 'MOMO_SECRET_KEY';
        if (!process.env.MOMO_PARTNER_CODE) {
            console.warn('⚠️  MOMO_PARTNER_CODE not set - using default value. Payment will not work in production.');
        }
    }
    async createPayment(orderId, amount, returnUrl, ipnUrl) {
        const requestId = `${orderId}_${Date.now()}`;
        const orderInfo = `BookStore Order ${orderId}`;
        const requestType = 'captureWallet';
        const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${requestId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');
        const requestBody = {
            partnerCode: this.partnerCode,
            partnerName: 'BookStore',
            storeId: 'BookStore',
            requestId,
            amount,
            orderId: requestId,
            orderInfo,
            redirectUrl: returnUrl,
            ipnUrl,
            lang: 'vi',
            requestType,
            autoCapture: true,
            extraData: '',
            signature,
        };
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            const transaction = new this.transactionModel({
                order: orderId,
                provider: 'momo',
                transactionId: requestId,
                amount,
                status: 'pending',
                rawResponse: data,
            });
            await transaction.save();
            return data;
        }
        catch (error) {
            console.error('Momo payment error:', error);
            throw error;
        }
    }
    async handleCallback(body) {
        try {
            const rawSignature = `accessKey=${this.accessKey}&amount=${body.amount}&extraData=${body.extraData}&message=${body.message}&orderId=${body.orderId}&orderInfo=${body.orderInfo}&orderType=${body.orderType}&partnerCode=${body.partnerCode}&payType=${body.payType}&requestId=${body.requestId}&responseTime=${body.responseTime}&resultCode=${body.resultCode}&transId=${body.transId}`;
            const signature = crypto
                .createHmac('sha256', this.secretKey)
                .update(rawSignature)
                .digest('hex');
            if (signature !== body.signature) {
                return { resultCode: 97, message: 'Invalid signature' };
            }
            const orderId = body.orderId.split('_')[0];
            await this.transactionModel.findOneAndUpdate({ transactionId: body.requestId }, {
                status: body.resultCode === 0 ? 'success' : 'failed',
                rawResponse: body,
                errorMessage: body.resultCode !== 0 ? body.message : undefined,
            });
            if (body.resultCode === 0) {
                await this.orderModel.findByIdAndUpdate(orderId, {
                    status: 'paid',
                    transactionId: body.transId,
                    paidAt: new Date(),
                });
                return { resultCode: 0, message: 'Success' };
            }
            return { resultCode: body.resultCode, message: body.message };
        }
        catch (error) {
            console.error('Momo callback error:', error);
            return { resultCode: 99, message: 'Unknown error' };
        }
    }
    validateSignature(data, signature) {
        const rawSignature = Object.keys(data)
            .sort()
            .map((key) => `${key}=${data[key]}`)
            .join('&');
        const expectedSignature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');
        return signature === expectedSignature;
    }
};
exports.MomoService = MomoService;
exports.MomoService = MomoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MomoService);
//# sourceMappingURL=momo.service.js.map