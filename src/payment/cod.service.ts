import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class CodService {
    constructor(private ordersService: OrdersService) { }

    async createCodOrder(orderData: {
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
        // Create order with COD payment method
        const order = await this.ordersService.create(
            {
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
            },
            orderData.userId
        );

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

    private calculateDeliveryDate(): string {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days delivery
        return deliveryDate.toISOString().split('T')[0];
    }
}
