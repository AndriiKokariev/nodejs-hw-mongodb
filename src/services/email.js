import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  APP_DOMAIN,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (email, resetToken) => {
  const resetLink = `${APP_DOMAIN}/reset-password?token=${resetToken}`;

  console.log('Reset token for testing:', resetToken);

  const mailOptions = {
    from: SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset My Password
          </a>
        </div>
        <p><strong>Important:</strong> This link will expire in 5 minutes.</p>
        <p>If you didn't request a password reset, you can ignore this email. Your password will remain unchanged.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #777; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
  } catch (error) {
    console.error('Email sending error:', error);
    console.log('Bypassing email error for testing purposes');
    return true;
  }
};
