import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { UserModel } from '@/lib/db/models/User';
import { VisitorModel, DailyAnalyticsModel } from '@/lib/db/models/Visitor';
import { AnalyticsEventModel } from '@/lib/db/models/AnalyticsEvent';
import { ProjectModel } from '@/lib/db/models/Project';
import { checkAdminAuth } from '@/lib/auth/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const isAuth = await checkAdminAuth(req);
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
          projectViews: 0,
          liveClicks: 0,
          githubClicks: 0,
          resumeDownloads: 0,
        },
        devices: { desktop: 0, mobile: 0, tablet: 0 },
        browsers: {},
        referrers: {},
        chartData: [],
        projectStats: [],
        recruiters: [],
        recentVisitors: [],
      });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30d';
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const projectSlugFilter = searchParams.get('projectSlug');

    // Determine Date Range
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'yesterday') {
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === '90d') {
      startDate.setDate(startDate.getDate() - 90);
    } else if (period === 'this_year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (period === 'all') {
      startDate = new Date(2024, 0, 1);
    } else if (period === 'custom' && fromParam) {
      startDate = new Date(fromParam);
      if (toParam) endDate = new Date(toParam);
    } else {
      startDate.setDate(startDate.getDate() - 30);
    }

    const eventFilter: Record<string, unknown> = {
      timestamp: { $gte: startDate, $lte: endDate },
    };

    if (projectSlugFilter && projectSlugFilter !== 'all') {
      eventFilter.projectSlug = projectSlugFilter;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Execute queries in parallel for optimal speed
    const [
      eventsCount,
      uniqueVisitorsAgg,
      eventTypesAgg,
      deviceAgg,
      browserAgg,
      referrerAgg,
      totalVisitorsCount,
      guestVisitorsCount,
      totalRecruitersCount,
      todayAnalytics,
      recruitersList,
      recentVisitorsList,
      projectsList,
      dailyTrendAgg,
    ] = await Promise.all([
      AnalyticsEventModel.countDocuments(eventFilter),
      AnalyticsEventModel.distinct('visitorId', eventFilter),
      AnalyticsEventModel.aggregate([
        { $match: eventFilter },
        { $group: { _id: '$eventType', count: { $sum: 1 } } },
      ]),
      AnalyticsEventModel.aggregate([
        { $match: eventFilter },
        { $group: { _id: '$device', count: { $sum: 1 } } },
      ]),
      AnalyticsEventModel.aggregate([
        { $match: eventFilter },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
      ]),
      AnalyticsEventModel.aggregate([
        { $match: eventFilter },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
      ]),
      VisitorModel.countDocuments(),
      VisitorModel.countDocuments({ type: 'guest' }),
      UserModel.countDocuments(),
      DailyAnalyticsModel.findOne({ date: todayStr }).lean(),
      UserModel.find().sort({ lastLoginAt: -1 }).limit(50).lean(),
      VisitorModel.find()
        .populate('userId', 'name email company role')
        .sort({ lastVisitedAt: -1 })
        .limit(30)
        .lean(),
      ProjectModel.find().select('name slug category status tier stats image links sortOrder').sort({ sortOrder: 1 }).lean(),
      AnalyticsEventModel.aggregate([
        { $match: eventFilter },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
            views: {
              $sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0] },
            },
            uniqueVisitors: { $addToSet: '$visitorId' },
            events: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Format event counters
    const eventsMap: Record<string, number> = {};
    for (const item of eventTypesAgg) {
      eventsMap[item._id] = item.count;
    }

    // Format device distribution
    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    for (const item of deviceAgg) {
      if (item._id === 'mobile') devices.mobile = item.count;
      else if (item._id === 'tablet') devices.tablet = item.count;
      else devices.desktop = (devices.desktop || 0) + item.count;
    }

    // Format browsers
    const browsers: Record<string, number> = {};
    for (const item of browserAgg) {
      browsers[item._id || 'Other'] = item.count;
    }

    // Format referrers
    const referrers: Record<string, number> = {};
    for (const item of referrerAgg) {
      let ref = item._id || 'Direct';
      if (ref.includes('google')) ref = 'Google';
      else if (ref.includes('github')) ref = 'GitHub';
      else if (ref.includes('linkedin')) ref = 'LinkedIn';
      else if (ref.includes('twitter') || ref.includes('x.com')) ref = 'X / Twitter';
      else if (ref === '') ref = 'Direct';

      referrers[ref] = (referrers[ref] || 0) + item.count;
    }

    // Format daily trend data for charts
    const chartData = dailyTrendAgg.map((item) => ({
      date: item._id,
      views: item.views || 0,
      uniqueVisitors: item.uniqueVisitors?.length || 0,
      events: item.events || 0,
    }));

    // Calculate total all-time page views from Visitor records
    const viewsAgg = await VisitorModel.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewsCount' } } },
    ]);
    const allTimeViews = viewsAgg[0]?.totalViews || totalVisitorsCount;

    return NextResponse.json({
      isConnected: true,
      period,
      overview: {
        totalViews: allTimeViews,
        periodEventsCount: eventsCount,
        periodPageViews: eventsMap['page_view'] || 0,
        periodUniqueVisitors: uniqueVisitorsAgg.length,
        totalRecruiters: totalRecruitersCount,
        uniqueGuests: guestVisitorsCount,
        todayViews: todayAnalytics?.totalViews || 0,
        todayGuests: todayAnalytics?.uniqueGuests?.length || 0,
        todayRecruiters: todayAnalytics?.uniqueUsers?.length || 0,
        projectViews: eventsMap['project_view'] || 0,
        liveClicks: eventsMap['live_demo_click'] || 0,
        githubClicks: eventsMap['github_click'] || 0,
        resumeDownloads: eventsMap['resume_download'] || 0,
        contactSubmits: eventsMap['contact_submit'] || 0,
      },
      devices,
      browsers,
      referrers,
      chartData,
      projectStats: projectsList,
      recruiters: recruitersList,
      recentVisitors: recentVisitorsList,
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
