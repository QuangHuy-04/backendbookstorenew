export declare class OtpService {
    private otpStore;
    generateOTP(): string;
    storeOTP(email: string, otp: string): Promise<void>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
    generateResetToken(): string;
    storeCaptcha(id: string, text: string): Promise<void>;
    verifyCaptcha(id: string, text: string): Promise<boolean>;
}
