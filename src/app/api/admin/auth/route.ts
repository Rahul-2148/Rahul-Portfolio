import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';

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

    // 2. EMERGENCY RESET VIA RECOVERY KEY ACTION
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

    // 3. LOGOUT ACTION
    if (action === 'logout') {
      const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully.',
      });
      response.cookies.delete('portfolio_admin_token');
      return response;
    }

    // 4. STANDARD LOGIN ACTION
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
      hasCustomPasscode: effectivePasscode !== (process.env.ADMIN_PASSCODE || 'rahul2148'),
    });
  } catch {
    return NextResponse.json({
      authenticated: false,
    });
  }
}
