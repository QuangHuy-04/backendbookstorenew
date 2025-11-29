import { Controller, Get, Post, Body, Param, UseGuards, Query, Delete } from '@nestjs/common';
import { PromoCodesService } from './promo-codes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('promo-codes')
export class PromoCodesController {
    constructor(private readonly promoCodesService: PromoCodesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    create(@Body() createPromoCodeDto: any) {
        return this.promoCodesService.create(createPromoCodeDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    findAll() {
        return this.promoCodesService.findAll();
    }

    @Get('validate')
    async validate(@Query('code') code: string, @Query('orderValue') orderValue: number) {
        return this.promoCodesService.validate(code, Number(orderValue));
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    remove(@Param('id') id: string) {
        return this.promoCodesService.remove(id);
    }
}
