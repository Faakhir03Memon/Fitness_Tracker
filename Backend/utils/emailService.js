const nodemailer = require('nodemailer');

// Configure email transporter using Gmail
// USER: Set these in your .env file:
// EMAIL_USER=your_gmail@gmail.com
// EMAIL_PASS=your_gmail_app_password  (not your main password - get App Password from Google Account > Security)
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send verification email on signup
const sendVerificationEmail = async (toEmail, name, token) => {
    const transporter = createTransporter();
    const verifyLink = `http://localhost:5173/verify-email/${token}`;

    await transporter.sendMail({
        from: `"FitTrack Official Support" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: '✅ Verify Your FitTrack Account',
        html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #0d1117; color: white; border-radius: 16px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #00ff89, #00b4d8); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px; color: black; letter-spacing: 2px;">FITTRACK</h1>
                    <p style="color: rgba(0,0,0,0.7); margin: 5px 0 0;">Premium Fitness Platform</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #00ff89;">Hey ${name}! 👋</h2>
                    <p style="color: #94a3b8; line-height: 1.7;">Welcome to FitTrack! You're one step away from unlocking your personalized fitness command center.</p>
                    <p style="color: #94a3b8; line-height: 1.7;">Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${verifyLink}" style="background: #00ff89; color: black; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 16px; letter-spacing: 1px;">VERIFY MY ACCOUNT</a>
                    </div>
                    <p style="color: #475569; font-size: 12px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
                </div>
                <div style="background: #080c10; padding: 20px; text-align: center;">
                    <p style="color: #475569; font-size: 12px; margin: 0;">© 2025 FitTrack. All rights reserved.</p>
                </div>
            </div>
        `
    });
};

// Send password reset email
const sendPasswordResetEmail = async (toEmail, name, token) => {
    const transporter = createTransporter();
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
        from: `"FitTrack Official Support" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: '🔐 Reset Your FitTrack Password',
        html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #0d1117; color: white; border-radius: 16px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px; color: white; letter-spacing: 2px;">FITTRACK</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Password Reset Request</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #f59e0b;">Reset Your Password 🔑</h2>
                    <p style="color: #94a3b8; line-height: 1.7;">Hi ${name}, we received a request to reset your FitTrack password.</p>
                    <p style="color: #94a3b8; line-height: 1.7;">Click the button below to set a new password:</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${resetLink}" style="background: #f59e0b; color: black; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 16px; letter-spacing: 1px;">RESET MY PASSWORD</a>
                    </div>
                    <p style="color: #ef4444; font-size: 13px; background: rgba(239,68,68,0.1); padding: 12px; border-radius: 8px;">⚠️ This link expires in 1 hour. If you didn't request this, ignore this email.</p>
                </div>
                <div style="background: #080c10; padding: 20px; text-align: center;">
                    <p style="color: #475569; font-size: 12px; margin: 0;">© 2025 FitTrack. All rights reserved.</p>
                </div>
            </div>
        `
    });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
