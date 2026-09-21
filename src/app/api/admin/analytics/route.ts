import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import { UserModel } from '@/lib/db/models/User';
import { VisitorModel, DailyAnalyticsModel } from '@/lib/db/models/Visitor';

async function isAuthenticatedAdmin(req: NextRequest): Promise<boolean> {
  const cookieToken = req.cookies.get('portfolio_admin_token')?.value;
  if (!cookieToken) return false;

  let passcode = process.env.ADMIN_PASSCODE || 'rahul2148';
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const doc = await PortfolioModel.findOne({ docId: 'main' }).select('security').lean();
      if (doc?.security?.customPasscode) {
        passcode = doc.security.customPasscode;
      }
    }
  } catch {
    // fallback to env
  }

  const expectedToken = 'authenticated_' + Buffer.from(passcode).toString('base64');
  return cookieToken === expectedToken;
}

export async function GET(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        isConnected: false,
        overview: {
          totalViews: 0,
          uniqueGuests: 0,
          totalRecruiters: 0,
          todayViews: 0,
          todayGuests: 0,
          todayRecruiters: 0,
        },
        recruiters: [],
        recentVisitors: [],
        daily: [],
      });
    }

    await connectToDatabase();

    const today = new Date().toISOString().split('T')[0];

    // Parallel queries for fast loading
    const [
      totalVisitorsCount,
      guestVisitorsCount,
      totalUsersCount,
      todayAnalytics,
      recruitersList,
      recentVisitorsList,
      recentDaysAnalytics,
    ] = await Promise.all([
      VisitorModel.countDocuments(),
      VisitorModel.countDocuments({ type: 'guest' }),
      UserModel.countDocuments(),
      DailyAnalyticsModel.findOne({ date: today }).lean(),
      UserModel.find().sort({ lastLoginAt: -1 }).limit(50).lean(),
      VisitorModel.find()
        .populate('userId', 'name email company role')
        .sort({ lastVisitedAt: -1 })
        .limit(30)
        .lean(),
      DailyAnalyticsModel.find().sort({ date: -1 }).limit(14).lean(),
    ]);

    // Calculate all-time views aggregation
    const viewsAgg = await VisitorModel.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewsCount' } } },
    ]);
    const totalViews = viewsAgg[0]?.totalViews || totalVisitorsCount;

    return NextResponse.json({
      isConnected: true,
      overview: {
        totalViews,
        uniqueGuests: guestVisitorsCount,
        totalRecruiters: totalUsersCount,
        todayViews: todayAnalytics?.totalViews || 0,
        todayGuests: todayAnalytics?.uniqueGuests?.length || 0,
        todayRecruiters: todayAnalytics?.uniqueUsers?.length || 0,
      },
      recruiters: recruitersList,
      recentVisitors: recentVisitorsList,
      daily: recentDaysAnalytics,
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
