import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createOrderDto: any, @Request() req) {
        return this.ordersService.create(createOrderDto, req.user.userId);
    }

    @Get('my-orders')
    @UseGuards(JwtAuthGuard)
    async getMyOrders(@Request() req) {
        return this.ordersService.findAll(req.user.userId);
    }

    @Get('admin/all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getAllOrdersAdmin() {
        return this.ordersService.getAllOrders();
    }


    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req) {
        return this.ordersService.findAll(req.user.userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Request() req) {
        return this.ordersService.findOne(id, req.user.userId);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.ordersService.updateStatus(id, status);
    }

    @Patch(':id/cancel')
    @UseGuards(JwtAuthGuard)
    async cancelOrder(@Param('id') id: string, @Request() req) {
        const isAdmin = req.user.role === 'admin';
        return this.ordersService.cancelOrder(id, req.user.userId, isAdmin);
    }
}
