import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: any, req: any): Promise<import("./schemas/order.schema").Order>;
    getMyOrders(req: any): Promise<import("./schemas/order.schema").Order[]>;
    getAllOrdersAdmin(): Promise<import("./schemas/order.schema").Order[]>;
    findAll(req: any): Promise<import("./schemas/order.schema").Order[]>;
    findOne(id: string, req: any): Promise<import("./schemas/order.schema").Order | null>;
    updateStatus(id: string, status: string): Promise<import("./schemas/order.schema").Order | null>;
    cancelOrder(id: string, req: any): Promise<import("./schemas/order.schema").Order | null>;
}
