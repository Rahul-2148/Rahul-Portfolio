import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PresenceModel } from '@/lib/db/models/Presence';
import { AnalyticsEventModel } from '@/lib/db/models/AnalyticsEvent';
import { checkAdminAuth } from '@/lib/auth/adminAuth';

export async function GET(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        onlineCount: 0,
        activeSessions: [],
        recentEvents: [],
      });
    }

    await connectToDatabase();

    const threshold = new Date(Date.now() - 45 * 1000);
    const [activePresences, recentEvents] = await Promise.all([
      PresenceModel.find({ lastHeartbeat: { $gte: threshold } })
        .sort({ lastHeartbeat: -1 })
        .limit(50)
        .lean(),
      AnalyticsEventModel.find()
        .sort({ timestamp: -1 })
        .limit(25)
        .lean(),
    ]);

    const now = Date.now();
    const activeSessions = activePresences.map((s) => ({
      id: s._id.toString(),
      visitorIdShort: s.visitorId.slice(-6),
      path: s.path,
      device: s.device,
      browser: s.browser,
      referrer: s.referrer || 'Direct',
      secondsAgo: Math.max(0, Math.round((now - new Date(s.lastHeartbeat).getTime()) / 1000)),
    }));

    const formattedEvents = recentEvents.map((e) => ({
      id: e._id.toString(),
      eventType: e.eventType,
      path: e.path,
      projectSlug: e.projectSlug,
      visitorIdShort: e.visitorId.slice(-6),
      device: e.device,
      browser: e.browser,
      referrer: e.referrer || 'Direct',
      metadata: e.metadata,
      timestamp: e.timestamp,
      secondsAgo: Math.max(0, Math.round((now - new Date(e.timestamp).getTime()) / 1000)),
    }));

    return NextResponse.json({
      success: true,
      onlineCount: activeSessions.length,
      activeSessions,
      recentEvents: formattedEvents,
    });
  } catch (err) {
    console.error('Error in realtime analytics API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
