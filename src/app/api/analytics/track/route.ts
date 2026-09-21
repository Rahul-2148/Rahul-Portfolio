import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { VisitorModel, DailyAnalyticsModel } from '@/lib/db/models/Visitor';
import { AnalyticsEventModel } from '@/lib/db/models/AnalyticsEvent';
import { ProjectModel } from '@/lib/db/models/Project';

function parseUserAgent(ua: string) {
  const uaLower = ua.toLowerCase();
  let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(uaLower)) {
    device = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(uaLower)) {
    device = 'mobile';
  }

  let browser = 'Other';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  let os = 'Other';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua) && !/android/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

  return { device, browser, os };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      visitorId,
      path = '/',
      referrer = '',
      eventType = 'page_view',
      projectSlug,
      metadata = {},
    } = body;

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
    const rawIp = forwardedFor.split(',')[0].trim() || 'unknown';
    const anonymizedIp = rawIp === 'unknown' ? 'unknown' : rawIp.replace(/\.\d+$/, '.***');
    const { device, browser, os } = parseUserAgent(userAgent);

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
          ip: anonymizedIp.slice(0, 45),
          referrer: referrer.slice(0, 200),
        },
        $inc: { viewsCount: 1 },
      },
      { upsert: true, new: true }
    );

    // 2. Log Granular Telemetry Event
    await AnalyticsEventModel.create({
      eventType,
      visitorId,
      path: path.slice(0, 200),
      projectSlug: projectSlug ? String(projectSlug).slice(0, 100) : '',
      referrer: referrer.slice(0, 200),
      device,
      browser,
      os,
      metadata,
      timestamp: new Date(),
    });

    // 3. Increment Project Stats if relevant
    if (projectSlug) {
      const incFields: Record<string, number> = {};
      if (eventType === 'project_view') incFields['stats.views'] = 1;
      if (eventType === 'live_demo_click') incFields['stats.liveClicks'] = 1;
      if (eventType === 'github_click') incFields['stats.githubClicks'] = 1;

      if (Object.keys(incFields).length > 0) {
        await ProjectModel.updateOne({ slug: projectSlug }, { $inc: incFields });
      }
    }

    // 4. Update Daily Aggregated Rollup (YYYY-MM-DD)
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
