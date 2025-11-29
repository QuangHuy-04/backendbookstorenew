import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendOTP(email: string, otp: string) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Mã xác thực OTP - BookStore',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Xác thực tài khoản của bạn</h2>
                    <p>Mã OTP của bạn là:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #666; margin-top: 20px;">Mã này sẽ hết hạn sau 5 phút.</p>
                    <p style="color: #999; font-size: 12px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                </div>
            `,
        });
    }

    async sendPasswordReset(email: string, resetToken: string) {
        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Đặt lại mật khẩu - BookStore',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Đặt lại mật khẩu</h2>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                    <p>Nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Đặt lại mật khẩu
                        </a>
                    </div>
                    <p style="color: #666;">Hoặc sao chép liên kết sau vào trình duyệt:</p>
                    <p style="color: #007bff; word-break: break-all;">${resetUrl}</p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">Link này sẽ hết hạn sau 1 giờ.</p>
                    <p style="color: #999; font-size: 12px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                </div>
            `,
        });
    }
}
