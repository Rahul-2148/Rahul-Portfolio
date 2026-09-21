import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import { sendOtpEmail } from '@/lib/email/mailer';

async function getEffectivePasscode(): Promise<string> {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const doc = await PortfolioModel.findOne({ docId: 'main' }).select('security').lean();
      if (doc?.security?.customPasscode && doc.security.customPasscode.trim().length > 0) {
        return doc.security.customPasscode.trim();
      }
    }
  } catch (err) {
    console.error('Error fetching dynamic admin passcode from DB:', err);
  }
  return process.env.ADMIN_PASSCODE || 'rahul2148';
}

function createSessionCookie(response: NextResponse, passcode: string) {
  response.cookies.set({
    name: 'portfolio_admin_token',
    value: 'authenticated_' + Buffer.from(passcode).toString('base64'),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'login';
    const effectivePasscode = await getEffectivePasscode();

    // 1. CHANGE PASSCODE ACTION
    if (action === 'change_passcode') {
      const { currentPasscode, newPasscode } = body;

      if (!currentPasscode || currentPasscode !== effectivePasscode) {
        return NextResponse.json(
          { error: 'Current passcode is incorrect.' },
          { status: 401 }
        );
      }

      if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 4) {
        return NextResponse.json(
          { error: 'New passcode must be at least 4 characters long.' },
          { status: 400 }
        );
      }

      const cleanNewPasscode = newPasscode.trim();

      // Persist to MongoDB
      await connectToDatabase();
      await PortfolioModel.findOneAndUpdate(
        { docId: 'main' },
        { 
          $set: { 
            'security.customPasscode': cleanNewPasscode, 
            'security.updatedAt': new Date() 
          } 
        },
        { upsert: true }
      );

      const response = NextResponse.json({
        success: true,
        message: 'Admin passcode updated successfully in cloud database.',
      });

      // Update session cookie to match new passcode
      createSessionCookie(response, cleanNewPasscode);
      return response;
    }

    // 2. SEND EMAIL OTP ACTION
    if (action === 'send_email_otp') {
      const adminEmail = process.env.ADMIN_EMAIL || 'rahulraj2148@gmail.com';
      await connectToDatabase();

      // Check cooldown (45 seconds)
      const currentDoc = await PortfolioModel.findOne({ docId: 'main' }).select('security').lean();
      const lastRequested = currentDoc?.security?.otp?.lastRequestedAt;
      if (lastRequested && Date.now() - new Date(lastRequested).getTime() < 45000) {
        const remaining = Math.ceil((45000 - (Date.now() - new Date(lastRequested).getTime())) / 1000);
        return NextResponse.json(
          { error: `Please wait ${remaining}s before requesting a new OTP.` },
          { status: 429 }
        );
      }

      // Generate 6-digit numeric OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await PortfolioModel.findOneAndUpdate(
        { docId: 'main' },
        {
          $set: {
            'security.adminEmail': adminEmail,
            'security.otp.code': otp,
            'security.otp.expiresAt': expiresAt,
            'security.otp.lastRequestedAt': new Date(),
          },
        },
        { upsert: true }
      );

      const emailResult = await sendOtpEmail(adminEmail, otp);

      return NextResponse.json({
        success: true,
        message: emailResult.message,
        simulated: emailResult.simulated,
        devOtp: emailResult.previewOtp,
        adminEmail,
      });
    }

    // 3. VERIFY EMAIL OTP & RESET PASSCODE ACTION
    if (action === 'verify_email_otp') {
      const { otp, newPasscode } = body;

      if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
        return NextResponse.json(
          { error: 'Please enter a valid 6-digit verification OTP.' },
          { status: 400 }
        );
      }

      if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 4) {
        return NextResponse.json(
          { error: 'New passcode must be at least 4 characters long.' },
          { status: 400 }
        );
      }

      await connectToDatabase();
      const currentDoc = await PortfolioModel.findOne({ docId: 'main' }).select('security').lean();
      const savedOtp = currentDoc?.security?.otp;

      if (!savedOtp || !savedOtp.code) {
        return NextResponse.json(
          { error: 'No active OTP found. Please click Send OTP first.' },
          { status: 400 }
        );
      }

      if (!savedOtp.expiresAt || new Date(savedOtp.expiresAt).getTime() < Date.now()) {
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new verification code.' },
          { status: 400 }
        );
      }

      if (savedOtp.code.trim() !== otp.trim()) {
        return NextResponse.json(
          { error: 'Invalid verification OTP code. Please check your email.' },
          { status: 401 }
        );
      }

      const cleanNewPasscode = newPasscode.trim();

      // Clear OTP and update passcode in database
      await PortfolioModel.findOneAndUpdate(
        { docId: 'main' },
        {
          $set: {
            'security.customPasscode': cleanNewPasscode,
            'security.otp.code': '',
            'security.otp.expiresAt': null,
            'security.updatedAt': new Date(),
          },
        },
        { upsert: true }
      );

      const response = NextResponse.json({
        success: true,
        message: 'Passcode successfully reset using Email OTP!',
      });

      createSessionCookie(response, cleanNewPasscode);
      return response;
    }

    // 4. EMERGENCY RESET VIA RECOVERY KEY ACTION
    if (action === 'reset_passcode') {
      const { recoveryKey, newPasscode } = body;
      const masterRecoveryKey = process.env.ADMIN_RECOVERY_KEY || 'RAHUL-RECOVER-2026-SECRET';

      if (!recoveryKey || recoveryKey.trim() !== masterRecoveryKey) {
        return NextResponse.json(
          { error: 'Invalid Master Recovery Key. Please check your ADMIN_RECOVERY_KEY in .env.local' },
          { status: 401 }
        );
      }

      if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 4) {
        return NextResponse.json(
          { error: 'New passcode must be at least 4 characters long.' },
          { status: 400 }
        );
      }

      const cleanNewPasscode = newPasscode.trim();

      // Persist reset passcode to MongoDB
      await connectToDatabase();
      await PortfolioModel.findOneAndUpdate(
        { docId: 'main' },
        { 
          $set: { 
            'security.customPasscode': cleanNewPasscode, 
            'security.updatedAt': new Date() 
          } 
        },
        { upsert: true }
      );

      const response = NextResponse.json({
        success: true,
        message: 'Passcode reset successfully using Master Recovery Key!',
      });

      createSessionCookie(response, cleanNewPasscode);
      return response;
    }

    // 5. LOGOUT ACTION
    if (action === 'logout') {
      const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully.',
      });
      response.cookies.delete('portfolio_admin_token');
      return response;
    }

    // 6. STANDARD LOGIN ACTION
    const { passcode } = body;
    if (!passcode || passcode !== effectivePasscode) {
      return NextResponse.json(
        { error: 'Invalid Passcode. Access Denied.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful. Welcome to Admin Studio.',
    });

    createSessionCookie(response, effectivePasscode);
    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('portfolio_admin_token')?.value;
    const effectivePasscode = await getEffectivePasscode();
    const expectedToken = 'authenticated_' + Buffer.from(effectivePasscode).toString('base64');

    const isAuthenticated = cookieToken === expectedToken;

    return NextResponse.json({
      authenticated: isAuthenticated,
      adminEmail: process.env.ADMIN_EMAIL || 'rahulraj2148@gmail.com',
      hasCustomPasscode: effectivePasscode !== (process.env.ADMIN_PASSCODE || 'rahul2148'),
    });
  } catch {
    return NextResponse.json({
      authenticated: false,
    });
  }
}
