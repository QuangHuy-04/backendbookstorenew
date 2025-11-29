import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Profile Management
    @Get('profile')
    async getProfile(@Request() req) {
        return this.usersService.findOne(req.user.userId);
    }

    @Put('profile')
    async updateProfile(@Request() req, @Body() updateData: { name?: string; phone?: string }) {
        return this.usersService.updateProfile(req.user.userId, updateData);
    }

    @Post('change-password')
    async changePassword(
        @Request() req,
        @Body() passwordData: { currentPassword: string; newPassword: string }
    ) {
        await this.usersService.changePassword(
            req.user.userId,
            passwordData.currentPassword,
            passwordData.newPassword
        );
        return { message: 'Password changed successfully' };
    }

    // Address Management
    @Get('addresses')
    async getAddresses(@Request() req) {
        return this.usersService.getAddresses(req.user.userId);
    }

    @Post('addresses')
    async addAddress(@Request() req, @Body() addressData: any) {
        return this.usersService.addAddress(req.user.userId, addressData);
    }

    @Put('addresses/:id')
    async updateAddress(
        @Request() req,
        @Param('id') id: string,
        @Body() addressData: any
    ) {
        return this.usersService.updateAddress(req.user.userId, id, addressData);
    }

    @Delete('addresses/:id')
    async deleteAddress(@Request() req, @Param('id') id: string) {
        await this.usersService.deleteAddress(req.user.userId, id);
        return { message: 'Address deleted successfully' };
    }

    @Put('addresses/:id/default')
    async setDefaultAddress(@Request() req, @Param('id') id: string) {
        return this.usersService.setDefaultAddress(req.user.userId, id);
    }

    // Favorites Management
    @Get('favorites')
    async getFavorites(@Request() req) {
        return this.usersService.getFavorites(req.user.userId);
    }

    @Post('favorites/:bookId')
    async addToFavorites(
        @Request() req,
        @Param('bookId') bookId: string,
    ) {
        await this.usersService.addToFavorites(req.user.userId, bookId);
        return { message: 'Book added to favorites' };
    }

    @Delete('favorites/:bookId')
    async removeFromFavorites(
        @Request() req,
        @Param('bookId') bookId: string,
    ) {
        await this.usersService.removeFromFavorites(req.user.userId, bookId);
        return { message: 'Book removed from favorites' };
    }
}
