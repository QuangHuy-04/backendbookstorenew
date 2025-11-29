import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({
        required: function () {
            return !this.googleId;
        }
    })
    password: string;

    @Prop({
        required: function () {
            return !this.googleId;
        }
    })
    name: string;

    @Prop({ default: 'user', enum: ['user', 'admin'] })
    role: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop()
    city: string;

    @Prop()
    zipCode: string;

    @Prop()
    googleId: string;

    @Prop({ default: true })
    isActive: boolean;

    // Failed login tracking for account locking
    @Prop({ default: 0 })
    failedLoginAttempts: number;

    @Prop()
    lockUntil: Date;

    // Password reset tokens
    @Prop()
    resetPasswordToken: string;

    @Prop()
    resetPasswordExpires: Date;

    // OTP for email verification
    @Prop()
    otpCode: string;

    @Prop()
    otpExpires: Date;

    // Favorites - array of book IDs
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Book' }], default: [] })
    favorites: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
