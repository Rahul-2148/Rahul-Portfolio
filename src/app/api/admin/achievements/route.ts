import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import { Achievement } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' }).lean();
    return NextResponse.json({ success: true, achievements: doc?.achievements || [] });
  } catch (err) {
    console.error('Error fetching admin achievements:', err);
    return NextResponse.json({ success: true, achievements: [] });
  }
}

export async function POST(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const ach: Achievement = await req.json();
    if (!ach.title || !ach.issuer) {
      return NextResponse.json({ error: 'Missing title or issuer' }, { status: 400 });
    }

    if (!ach.id) {
      ach.id = `ach_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    }

    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' });
    const existing = (doc?.achievements || []) as Achievement[];
    existing.unshift(ach);

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      { $set: { achievements: existing } },
      { upsert: true, new: true }
    );

    await logAdminAction('create_achievement', 'achievements', { id: ach.id, title: ach.title });

    return NextResponse.json({ success: true, achievements: updated.achievements });
  } catch (err) {
    console.error('Error adding achievement:', err);
    return NextResponse.json({ error: 'Failed to add achievement' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedAch: Achievement = await req.json();
    if (!updatedAch.id) {
      return NextResponse.json({ error: 'Missing achievement id' }, { status: 400 });
    }

    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' });
    let existing = (doc?.achievements || []) as Achievement[];

    existing = existing.map((a) => (a.id === updatedAch.id ? { ...a, ...updatedAch } : a));

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      { $set: { achievements: existing } },
      { upsert: true, new: true }
    );

    await logAdminAction('update_achievement', 'achievements', { id: updatedAch.id, title: updatedAch.title });

    return NextResponse.json({ success: true, achievements: updated.achievements });
  } catch (err) {
    console.error('Error updating achievement:', err);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id param' }, { status: 400 });
    }

    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' });
    const existing = (doc?.achievements || []) as Achievement[];

    const filtered = existing.filter((a) => a.id !== id);

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      { $set: { achievements: filtered } },
      { upsert: true, new: true }
    );

    await logAdminAction('delete_achievement', 'achievements', { id });

    return NextResponse.json({ success: true, achievements: updated.achievements });
  } catch (err) {
    console.error('Error deleting achievement:', err);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
