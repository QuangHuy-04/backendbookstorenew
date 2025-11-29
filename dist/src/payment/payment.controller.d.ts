import { VNPayService } from './vnpay.service';
import { MomoService } from './momo.service';
import { CodService } from './cod.service';
export declare class PaymentController {
    private readonly vnpayService;
    private readonly momoService;
    private readonly codService;
    constructor(vnpayService: VNPayService, momoService: MomoService, codService: CodService);
    createVNPayPayment(body: {
        orderId: string;
        amount: number;
        returnUrl: string;
    }): {
        paymentUrl: string;
    };
    vnpayReturn(query: any): Promise<{
        success: boolean;
        message: string;
        transactionId?: undefined;
    } | {
        success: boolean;
        message: string;
        transactionId: any;
    }>;
    vnpayIPN(query: any): Promise<{
        RspCode: string;
        Message: string;
    }>;
    createMomoPayment(body: {
        orderId: string;
        amount: number;
        returnUrl: string;
        ipnUrl: string;
    }): Promise<any>;
    momoCallback(body: any): Promise<{
        resultCode: number;
        message: string;
    }>;
    createCodOrder(orderData: {
        userId: string;
        items: any[];
        shippingAddress: any;
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        discount?: number;
        promoCode?: string;
    }): Promise<{
        success: boolean;
        orderId: import("mongoose").Types.ObjectId;
        message: string;
        order: {
            id: import("mongoose").Types.ObjectId;
            total: number;
            paymentMethod: string;
            estimatedDelivery: string;
        };
    }>;
}
