import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./schemas/user.schema").User | null>;
    updateProfile(req: any, updateData: {
        name?: string;
        phone?: string;
    }): Promise<import("./schemas/user.schema").User>;
    changePassword(req: any, passwordData: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    getAddresses(req: any): Promise<import("./schemas/address.schema").Address[]>;
    addAddress(req: any, addressData: any): Promise<import("./schemas/address.schema").Address>;
    updateAddress(req: any, id: string, addressData: any): Promise<import("./schemas/address.schema").Address>;
    deleteAddress(req: any, id: string): Promise<{
        message: string;
    }>;
    setDefaultAddress(req: any, id: string): Promise<import("./schemas/address.schema").Address>;
    getFavorites(req: any): Promise<any>;
    addToFavorites(req: any, bookId: string): Promise<{
        message: string;
    }>;
    removeFromFavorites(req: any, bookId: string): Promise<{
        message: string;
    }>;
}
