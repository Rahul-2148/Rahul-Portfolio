import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ProjectModel } from '@/lib/db/models/Project';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const items = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    await connectToDatabase();

    const bulkOps = items.map((item: { id: string; sortOrder: number }) => {
      const isObjectId = mongoose.Types.ObjectId.isValid(item.id);
      return {
        updateOne: {
          filter: isObjectId ? { _id: item.id } : { slug: item.id },
          update: { $set: { sortOrder: item.sortOrder } },
        },
      };
    });

    await ProjectModel.bulkWrite(bulkOps);
    await logAdminAction('projects_reordered', 'projects', { count: items.length });

    return NextResponse.json({
      success: true,
      message: 'Project ordering saved successfully.',
    });
  } catch (err) {
    console.error('Error reordering projects:', err);
    return NextResponse.json({ error: 'Failed to reorder projects.' }, { status: 500 });
  }
}
