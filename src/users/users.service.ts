import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Address } from './schemas/address.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Address.name) private addressModel: Model<Address>
    ) { }

    async findOne(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        return this.userModel.findOne({ googleId }).exec();
    }

    async create(userData: {
        name: string;
        email: string;
        password?: string;
        googleId?: string;
        isActive?: boolean;
    }): Promise<User> {
        const user = new this.userModel(userData);
        return user.save();
    }

    async updatePassword(id: string, newPassword: string): Promise<User | null> {
        return this.userModel
            .findByIdAndUpdate(id, { password: newPassword }, { new: true })
            .exec();
    }

    async updateGoogleId(id: string, googleId: string): Promise<User | null> {
        return this.userModel
            .findByIdAndUpdate(id, { googleId }, { new: true })
            .exec();
    }

    async findByResetToken(token: string): Promise<User | null> {
        return this.userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        }).exec();
    }

    async addToFavorites(userId: string, bookId: string): Promise<User | null> {
        return this.userModel
            .findByIdAndUpdate(
                userId,
                { $addToSet: { favorites: bookId } },
                { new: true }
            )
            .exec();
    }

    async removeFromFavorites(userId: string, bookId: string): Promise<User | null> {
        return this.userModel
            .findByIdAndUpdate(
                userId,
                { $pull: { favorites: bookId } },
                { new: true }
            )
            .exec();
    }

    async getFavorites(userId: string): Promise<any> {
        const user = await this.userModel
            .findById(userId)
            .populate('favorites')
            .exec();
        return user?.favorites || [];
    }

    // Profile Management
    async updateProfile(userId: string, updateData: { name?: string; phone?: string }): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password').exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    }

    // Address Management
    async getAddresses(userId: string): Promise<Address[]> {
        return this.addressModel.find({ user: userId }).exec();
    }

    async addAddress(userId: string, addressData: Partial<Address>): Promise<Address> {
        // If this is set as default, unset other default addresses
        if (addressData.isDefault) {
            await this.addressModel.updateMany(
                { user: userId },
                { $set: { isDefault: false } }
            );
        }

        const address = new this.addressModel({
            ...addressData,
            user: userId
        });

        return address.save();
    }

    async updateAddress(userId: string, addressId: string, addressData: Partial<Address>): Promise<Address> {
        // If setting as default, unset other default addresses
        if (addressData.isDefault) {
            await this.addressModel.updateMany(
                { user: userId, _id: { $ne: addressId } },
                { $set: { isDefault: false } }
            );
        }

        const address = await this.addressModel.findOneAndUpdate(
            { _id: addressId, user: userId },
            { $set: addressData },
            { new: true }
        ).exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        return address;
    }

    async deleteAddress(userId: string, addressId: string): Promise<void> {
        const result = await this.addressModel.deleteOne({ _id: addressId, user: userId }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Address not found');
        }
    }

    async setDefaultAddress(userId: string, addressId: string): Promise<Address> {
        // Unset all other default addresses
        await this.addressModel.updateMany(
            { user: userId },
            { $set: { isDefault: false } }
        );

        // Set this address as default
        const address = await this.addressModel.findOneAndUpdate(
            { _id: addressId, user: userId },
            { $set: { isDefault: true } },
            { new: true }
        ).exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        return address;
    }
}
