import nodemailer from 'nodemailer';

export interface SendOtpResult {
  success: boolean;
  simulated: boolean;
  message: string;
  previewOtp?: string;
}

export async function sendOtpEmail(toEmail: string, otp: string): Promise<SendOtpResult> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Check if real SMTP credentials are provided
  if (!user || !pass || pass.trim() === '') {
    // Elegant Dev Simulation Mode
    console.log('\n' + '='.repeat(64));
    console.log('📧 [PORTFOLIO ADMIN SECURITY] EMAIL OTP SIMULATION MODE');
    console.log('='.repeat(64));
    console.log(`Destination Email : ${toEmail}`);
    console.log(`Secret 6-Digit OTP: >>> ${otp} <<<`);
    console.log(`Validity          : 10 Minutes`);
    console.log(`Note              : To send directly to your inbox, set SMTP_PASS in .env.local`);
    console.log('='.repeat(64) + '\n');

    return {
      success: true,
      simulated: true,
      message: `OTP generated for ${toEmail}. In dev mode, your OTP is ${otp}`,
      previewOtp: otp,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; color: #f1f5f9;">
        <div style="background: #0f172a; padding: 24px; border-bottom: 1px solid #1e293b; text-align: center;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #00f0ff; letter-spacing: -0.5px;">
            Rahul Raj // Admin Studio Security
          </h1>
          <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8; font-family: monospace;">
            AUTHENTICATION &amp; PASSKEY RESET GATEWAY
          </p>
        </div>

        <div style="padding: 32px 24px; text-align: center;">
          <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 24px;">
            A passkey reset request was initiated for your Portfolio Admin Dashboard. Use the one-time verification code below to authorize this action:
          </p>

          <div style="display: inline-block; background: #020617; border: 2px dashed #00f0ff; border-radius: 12px; padding: 18px 36px; margin: 12px 0 24px;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; font-family: monospace; color: #00f0ff;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 12px; color: #94a3b8; font-family: monospace; margin: 0;">
            ⏱ This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
        </div>

        <div style="background: #070d18; padding: 16px 24px; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b; font-family: monospace;">
          If you did not request this code, you can safely ignore this email. Your admin passkey remains unchanged.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Rahul Portfolio Studio" <${user}>`,
      to: toEmail,
      subject: `[${otp}] Your Admin Passkey Reset Code — Rahul Portfolio`,
      text: `Your Admin Passkey Reset OTP is: ${otp}. It is valid for 10 minutes.`,
      html: htmlContent,
    });

    return {
      success: true,
      simulated: false,
      message: `OTP successfully sent to ${toEmail}. Please check your inbox!`,
    };
  } catch (err: unknown) {
    console.error('Failed to send real email via SMTP:', err);
    // Graceful fallback to simulation so the owner is never locked out
    return {
      success: true,
      simulated: true,
      message: `SMTP delivery failed. Simulation code: ${otp}`,
      previewOtp: otp,
    };
  }
}
