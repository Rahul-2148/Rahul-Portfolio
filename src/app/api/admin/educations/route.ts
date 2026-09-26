import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import { Education } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' }).lean();
    return NextResponse.json({ success: true, educations: doc?.educations || [] });
  } catch (err) {
    console.error('Error fetching admin educations:', err);
    return NextResponse.json({ success: true, educations: [] });
  }
}

export async function POST(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const edu: Education = await req.json();
    if (!edu.institution || !edu.degree) {
      return NextResponse.json({ error: 'Missing institution or degree' }, { status: 400 });
    }

    if (!edu.id) {
      edu.id = `edu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    }

    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' });
    const existing = (doc?.educations || []) as Education[];
    existing.unshift(edu);

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      { $set: { educations: existing } },
      { upsert: true, new: true }
    );

    await logAdminAction('create_education', 'educations', { id: edu.id, degree: edu.degree, institution: edu.institution });

    return NextResponse.json({ success: true, educations: updated.educations });
  } catch (err) {
    console.error('Error adding education:', err);
    return NextResponse.json({ error: 'Failed to add education' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedEdu: Education = await req.json();
    if (!updatedEdu.institution || !updatedEdu.degree) {
      return NextResponse.json({ error: 'Missing institution or degree' }, { status: 400 });
    }

    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' });
    let existing = (doc?.educations || []) as Education[];

    existing = existing.map((e) =>
      (e.id === updatedEdu.id || (e.degree === updatedEdu.degree && e.institution === updatedEdu.institution))
        ? { ...e, ...updatedEdu }
        : e
    );

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      { $set: { educations: existing } },
      { upsert: true, new: true }
    );

    await logAdminAction('update_education', 'educations', { id: updatedEdu.id, degree: updatedEdu.degree });

    return NextResponse.json({ success: true, educations: updated.educations });
  } catch (err) {
    console.error('Error updating education:', err);
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
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
    const degree = searchParams.get('degree');

    if (!id && !degree) {
      return NextResponse.json({ error: 'Missing id or degree' }, { status: 400 });
    }

    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' });
    const existing = (doc?.educations || []) as Education[];

    const filtered = existing.filter((e) => (id ? e.id !== id : e.degree !== degree));

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      { $set: { educations: filtered } },
      { upsert: true, new: true }
    );

    await logAdminAction('delete_education', 'educations', { id, degree });

    return NextResponse.json({ success: true, educations: updated.educations });
  } catch (err) {
    console.error('Error deleting education:', err);
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
