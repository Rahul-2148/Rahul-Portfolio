import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const correctPasscode = process.env.ADMIN_PASSCODE || 'rahul2148';

    if (!passcode || passcode !== correctPasscode) {
      return NextResponse.json(
        { error: 'Invalid Passcode. Access Denied.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful. Welcome to Admin Studio.',
    });

    // Set an HTTP-only session cookie valid for 7 days
    response.cookies.set({
      name: 'portfolio_admin_token',
      value: 'authenticated_' + Buffer.from(correctPasscode).toString('base64'),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const cookieToken = req.cookies.get('portfolio_admin_token')?.value;
  const correctPasscode = process.env.ADMIN_PASSCODE || 'rahul2148';
  const expectedToken = 'authenticated_' + Buffer.from(correctPasscode).toString('base64');

  const isAuthenticated = cookieToken === expectedToken;

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}
