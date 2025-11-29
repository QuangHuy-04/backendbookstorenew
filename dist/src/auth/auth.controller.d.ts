import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(name: string, email: string, password: string): Promise<{
        message: string;
        requireOtp: boolean;
    }>;
    signup(name: string, email: string, password: string): Promise<{
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
    getCaptcha(): Promise<{
        image: string;
        id: `${string}-${string}-${string}-${string}-${string}`;
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
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any, res: any): Promise<void>;
    sendOTP(email: string): Promise<{
        message: string;
    }>;
    verifyOTP(email: string, otp: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
    getCurrentUser(req: any): {
        id: any;
        email: any;
        name: any;
        role: any;
    };
}
