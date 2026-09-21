import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { AuditLogModel } from '@/lib/db/models/AuditLog';
import { checkAdminAuth } from '@/lib/auth/adminAuth';

export async function GET(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ logs: [] });
    }

    await connectToDatabase();
    const logs = await AuditLogModel.find().sort({ timestamp: -1 }).limit(50).lean();

    return NextResponse.json({ success: true, logs });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
