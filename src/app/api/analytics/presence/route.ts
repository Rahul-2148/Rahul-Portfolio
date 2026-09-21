import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PresenceModel } from '@/lib/db/models/Presence';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, path = '/', device = 'desktop', browser = 'unknown', referrer = '' } = body;

    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ error: 'visitorId required' }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ ok: true, fallback: true });
    }

    await connectToDatabase();

    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const rawIp = forwardedFor.split(',')[0].trim() || 'unknown';
    // Anonymize IP (hash/mask)
    const anonymizedIp = rawIp === 'unknown' ? 'unknown' : rawIp.replace(/\.\d+$/, '.***');

    await PresenceModel.findOneAndUpdate(
      { visitorId },
      {
        $set: {
          lastHeartbeat: new Date(),
          path: path.slice(0, 200),
          device: device.slice(0, 30),
          browser: browser.slice(0, 50),
          referrer: referrer.slice(0, 200),
          anonymizedIp,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Presence heartbeat error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ onlineCount: 1, activeSessions: [] });
    }

    await connectToDatabase();

    // 45 seconds threshold for active presence
    const threshold = new Date(Date.now() - 45 * 1000);
    const active = await PresenceModel.find({
      lastHeartbeat: { $gte: threshold },
    })
      .sort({ lastHeartbeat: -1 })
      .lean();

    const now = Date.now();
    const activeSessions = active.map((s) => ({
      visitorIdShort: s.visitorId.slice(-6),
      path: s.path,
      device: s.device,
      browser: s.browser,
      referrer: s.referrer || 'Direct',
      secondsAgo: Math.max(0, Math.round((now - new Date(s.lastHeartbeat).getTime()) / 1000)),
    }));

    return NextResponse.json({
      onlineCount: active.length,
      activeSessions,
    });
  } catch (err) {
    console.error('Error fetching presence:', err);
    return NextResponse.json({ onlineCount: 0, activeSessions: [] }, { status: 500 });
  }
}
