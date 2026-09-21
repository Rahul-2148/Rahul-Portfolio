import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { VisitorModel, DailyAnalyticsModel } from '@/lib/db/models/Visitor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, path = '/', referrer = '' } = body;

    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ error: 'visitorId is required' }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ ok: true, fallback: true });
    }

    await connectToDatabase();

    // Check if visitor has a recruiter user session cookie
    const visitorSession = req.cookies.get('visitor_session')?.value;
    let userId: string | null = null;
    let isUser = false;

    if (visitorSession) {
      try {
        const decoded = JSON.parse(Buffer.from(visitorSession, 'base64').toString('utf-8'));
        if (decoded?.id) {
          userId = decoded.id;
          isUser = true;
        }
      } catch {
        // Invalid session, treat as guest
      }
    }

    const userAgent = req.headers.get('user-agent') || '';
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const ip = forwardedFor.split(',')[0].trim() || 'unknown';

    // 1. Update/Upsert Visitor Profile
    await VisitorModel.findOneAndUpdate(
      { visitorId },
      {
        $set: {
          type: isUser ? 'user' : 'guest',
          userId: userId || null,
          lastVisitedAt: new Date(),
          lastPath: path,
          userAgent: userAgent.slice(0, 200),
          ip: ip.slice(0, 45),
          referrer: referrer.slice(0, 200),
        },
        $inc: { viewsCount: 1 },
      },
      { upsert: true, new: true }
    );

    // 2. Update Daily Aggregated Rollup (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    const updateQuery: Record<string, unknown> = {
      $inc: {
        totalViews: 1,
        [isUser ? 'userViews' : 'guestViews']: 1,
      },
      $addToSet: {
        [isUser ? 'uniqueUsers' : 'uniqueGuests']: visitorId,
      },
    };

    await DailyAnalyticsModel.findOneAndUpdate(
      { date: today },
      updateQuery,
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
