import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { SkillModel } from '@/lib/db/models/Skill';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import { seedInitialPortfolioData } from '@/lib/db/seed';

export async function GET(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database offline' }, { status: 503 });
    }

    const count = await SkillModel.countDocuments();
    if (count === 0) {
      await seedInitialPortfolioData();
    }

    const skills = await SkillModel.find().sort({ category: 1, sortOrder: 1, name: 1 }).lean();

    return NextResponse.json({
      success: true,
      skills,
      count: skills.length,
    });
  } catch (err) {
    console.error('Error fetching admin skills:', err);
    return NextResponse.json({ error: 'Failed to retrieve skills.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Skill name is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const name = body.name.trim();
    const slug = body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const updated = await SkillModel.findOneAndUpdate(
      { $or: [{ slug }, { name }] },
      {
        $set: {
          name,
          slug,
          domain: body.domain || 'IT',
          category: body.category || 'Frontend',
          level: body.level || 'proficient',
          projects: Array.isArray(body.projects) ? body.projects : [],
          description: body.description || '',
          icon: body.icon || '',
          color: body.color || '#00f0ff',
          officialUrl: body.officialUrl || '',
          sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
          active: body.active !== undefined ? Boolean(body.active) : true,
        },
      },
      { upsert: true, new: true }
    );

    await logAdminAction('skill_saved', name, { category: updated.category });

    return NextResponse.json({
      success: true,
      message: `Skill "${name}" saved successfully.`,
      skill: updated,
    });
  } catch (err) {
    console.error('Error saving skill:', err);
    return NextResponse.json({ error: 'Failed to save skill.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'Skill id or slug required' }, { status: 400 });
    }

    await connectToDatabase();
    const query = id ? { _id: id } : { slug };
    const deleted = await SkillModel.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await logAdminAction('skill_deleted', deleted.name);

    return NextResponse.json({
      success: true,
      message: `Skill "${deleted.name}" removed successfully.`,
    });
  } catch (err) {
    console.error('Error deleting skill:', err);
    return NextResponse.json({ error: 'Failed to delete skill.' }, { status: 500 });
  }
}
