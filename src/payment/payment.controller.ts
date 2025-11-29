import { Controller, Post, Get, Body, Query, Req } from '@nestjs/common';
import { VNPayService } from './vnpay.service';
import { MomoService } from './momo.service';
import { CodService } from './cod.service';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly vnpayService: VNPayService,
        private readonly momoService: MomoService,
        private readonly codService: CodService,
    ) { }

    @Post('vnpay/create')
    createVNPayPayment(@Body() body: { orderId: string; amount: number; returnUrl: string }) {
        const paymentUrl = this.vnpayService.createPaymentUrl(
            body.orderId,
            body.amount,
            body.returnUrl,
        );
        return { paymentUrl };
    }

    @Get('vnpay/return')
    async vnpayReturn(@Query() query: any) {
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

    @Post('vnpay/ipn')
    async vnpayIPN(@Query() query: any) {
        return await this.vnpayService.handleIPN(query);
    }

    @Post('momo/create')
    async createMomoPayment(
        @Body() body: { orderId: string; amount: number; returnUrl: string; ipnUrl: string },
    ) {
        return await this.momoService.createPayment(
            body.orderId,
            body.amount,
            body.returnUrl,
            body.ipnUrl,
        );
    }

    @Post('momo/callback')
    async momoCallback(@Body() body: any) {
        return await this.momoService.handleCallback(body);
    }

    @Post('cod')
    async createCodOrder(@Body() orderData: {
        userId: string;
        items: any[];
        shippingAddress: any;
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        discount?: number;
        promoCode?: string;
    }) {
        return this.codService.createCodOrder(orderData);
    }
}
