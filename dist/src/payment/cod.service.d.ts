import { OrdersService } from '../orders/orders.service';
export declare class CodService {
    private ordersService;
    constructor(ordersService: OrdersService);
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
    private calculateDeliveryDate;
}
