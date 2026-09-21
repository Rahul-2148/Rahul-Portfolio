import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ContactMessageModel } from '@/lib/db/models/ContactMessage';
import { checkAdminAuth } from '@/lib/auth/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const isAuth = await checkAdminAuth(req);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        messages: [],
        counts: { all: 0, unread: 0, read: 0, replied: 0, archived: 0 },
        isConnected: false,
      });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status') || 'all';
    const searchQuery = searchParams.get('search') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

    // Build filter
    const filter: Record<string, unknown> = {};

    if (statusParam && statusParam !== 'all') {
      filter.status = statusParam;
    }

    if (searchQuery.trim()) {
      const regex = new RegExp(searchQuery.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { subject: regex }, { message: regex }];
    }

    // Parallel execution for messages and category counts
    const [messages, unreadCount, readCount, repliedCount, archivedCount, totalCount] = await Promise.all([
      ContactMessageModel.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
      ContactMessageModel.countDocuments({ status: 'unread' }),
      ContactMessageModel.countDocuments({ status: 'read' }),
      ContactMessageModel.countDocuments({ status: 'replied' }),
      ContactMessageModel.countDocuments({ status: 'archived' }),
      ContactMessageModel.countDocuments(),
    ]);

    return NextResponse.json({
      messages,
      counts: {
        all: totalCount,
        unread: unreadCount,
        read: readCount,
        replied: repliedCount,
        archived: archivedCount,
      },
      isConnected: true,
    });
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
