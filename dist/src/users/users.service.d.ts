import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Address } from './schemas/address.schema';
export declare class UsersService {
    private userModel;
    private addressModel;
    constructor(userModel: Model<User>, addressModel: Model<Address>);
    findOne(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    create(userData: {
        name: string;
        email: string;
        password?: string;
        googleId?: string;
        isActive?: boolean;
    }): Promise<User>;
    updatePassword(id: string, newPassword: string): Promise<User | null>;
    updateGoogleId(id: string, googleId: string): Promise<User | null>;
    findByResetToken(token: string): Promise<User | null>;
    addToFavorites(userId: string, bookId: string): Promise<User | null>;
    removeFromFavorites(userId: string, bookId: string): Promise<User | null>;
    getFavorites(userId: string): Promise<any>;
    updateProfile(userId: string, updateData: {
        name?: string;
        phone?: string;
    }): Promise<User>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    getAddresses(userId: string): Promise<Address[]>;
    addAddress(userId: string, addressData: Partial<Address>): Promise<Address>;
    updateAddress(userId: string, addressId: string, addressData: Partial<Address>): Promise<Address>;
    deleteAddress(userId: string, addressId: string): Promise<void>;
    setDefaultAddress(userId: string, addressId: string): Promise<Address>;
}
