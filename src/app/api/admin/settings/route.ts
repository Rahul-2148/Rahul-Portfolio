import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import { personalInfo as defaultPersonalInfo } from '@/lib/data/portfolio';

export async function GET(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, personalInfo: defaultPersonalInfo });
    }

    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' }).lean();

    return NextResponse.json({
      success: true,
      personalInfo: doc?.personalInfo || defaultPersonalInfo,
    });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectToDatabase();

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      { $set: { personalInfo: body } },
      { upsert: true, new: true }
    );

    await logAdminAction('settings_updated', 'personalInfo', body);

    return NextResponse.json({
      success: true,
      message: 'Portfolio settings updated successfully.',
      personalInfo: updated.personalInfo,
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
