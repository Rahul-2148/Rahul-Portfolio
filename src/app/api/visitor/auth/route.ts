import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { UserModel } from '@/lib/db/models/User';
import { VisitorModel, DailyAnalyticsModel } from '@/lib/db/models/Visitor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, role, purpose, notes, visitorId } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and Work Email are required to get a Recruiter/Visitor Pass.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanCompany = (company || 'Independent / Client').trim();
    const cleanRole = (role || 'Recruiter / Hiring Lead').trim();
    const cleanPurpose = purpose || 'hiring';

    await connectToDatabase();

    // 1. Create or update user account
    const user = await UserModel.findOneAndUpdate(
      { email: cleanEmail },
      {
        $set: {
          name: cleanName,
          company: cleanCompany,
          role: cleanRole,
          purpose: cleanPurpose,
          notes: notes || '',
          lastLoginAt: new Date(),
        },
        $inc: { loginCount: 1 },
      },
      { upsert: true, new: true }
    );

    // 2. If visitorId was passed, upgrade the visitor record to 'user'
    if (visitorId) {
      await VisitorModel.findOneAndUpdate(
        { visitorId },
        {
          $set: {
            type: 'user',
            userId: user._id,
            lastVisitedAt: new Date(),
          },
        },
        { upsert: true }
      );

      const today = new Date().toISOString().split('T')[0];
      await DailyAnalyticsModel.findOneAndUpdate(
        { date: today },
        {
          $addToSet: { uniqueUsers: visitorId },
        },
        { upsert: true }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        purpose: user.purpose,
      },
      message: `Welcome, ${user.name}! Recruiter pass activated.`,
    });

    // Set 30-day visitor session cookie
    const sessionPayload = Buffer.from(
      JSON.stringify({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
      })
    ).toString('base64');

    response.cookies.set({
      name: 'visitor_session',
      value: sessionPayload,
      httpOnly: false, // accessible to client for fast greeting badge
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Visitor auth error:', error);
    return NextResponse.json({ error: 'Failed to authenticate visitor.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('visitor_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false });
    }

    const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
    return NextResponse.json({
      authenticated: true,
      user: decoded,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Signed out as visitor.' });
  response.cookies.delete('visitor_session');
  return response;
}
