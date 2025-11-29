import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { OtpService } from './otp.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailService;
    private otpService;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService, otpService: OtpService);
    register(name: string, email: string, password: string): Promise<{
        message: string;
        requireOtp: boolean;
    }>;
    verifyRegistration(email: string, otp: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: string;
        };
    }>;
    login(email: string, password: string, captcha?: string, captchaId?: string): Promise<{
        requireCaptcha: boolean;
        message: string;
        access_token?: undefined;
        refresh_token?: undefined;
        user?: undefined;
    } | {
        access_token: string;
        refresh_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: string;
            failedLoginAttempts: number;
        };
        requireCaptcha?: undefined;
        message?: undefined;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: string;
        };
    }>;
    validateUser(userId: string): Promise<import("../users/schemas/user.schema").User | null>;
    generateToken(payload: any, expiresIn?: string): string;
    sendOTP(email: string): Promise<{
        message: string;
    }>;
    verifyOTP(email: string, otp: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    generateCaptcha(): Promise<{
        image: string;
        id: `${string}-${string}-${string}-${string}-${string}`;
    }>;
}
