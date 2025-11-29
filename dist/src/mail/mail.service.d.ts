export declare class MailService {
    private transporter;
    constructor();
    sendOTP(email: string, otp: string): Promise<void>;
    sendPasswordReset(email: string, resetToken: string): Promise<void>;
}
