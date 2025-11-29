import { Document, Schema as MongooseSchema, Types } from 'mongoose';
export declare class User extends Document {
    email: string;
    password: string;
    name: string;
    role: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    googleId: string;
    isActive: boolean;
    failedLoginAttempts: number;
    lockUntil: Date;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    otpCode: string;
    otpExpires: Date;
    favorites: Types.ObjectId[];
}
export declare const UserSchema: MongooseSchema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
