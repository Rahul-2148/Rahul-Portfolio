import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import { deleteMedia } from '@/lib/cloudinary';
import { ResumeItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' }).lean();
    const resumesList = (doc?.resumes && Array.isArray(doc.resumes)) ? doc.resumes : [];
    return NextResponse.json({ success: true, resumes: resumesList });
  } catch (err) {
    console.error('Error fetching admin resumes:', err);
    return NextResponse.json({ success: true, resumes: [] });
  }
}

export async function POST(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resumeData: ResumeItem = await req.json();
    if (!resumeData.title || !resumeData.url) {
      return NextResponse.json({ error: 'Missing title or url' }, { status: 400 });
    }

    if (!resumeData.id) {
      resumeData.id = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    resumeData.uploadedAt = resumeData.uploadedAt || new Date().toISOString();

    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' });
    let existing = (doc?.resumes || []) as ResumeItem[];

    if (resumeData.isPrimary) {
      existing = existing.map((r) => ({ ...r, isPrimary: false }));
    }
    if (existing.length === 0) {
      resumeData.isPrimary = true;
    }

    existing.unshift(resumeData);

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      {
        $set: {
          resumes: existing,
          'personalInfo.resumeUrl': resumeData.isPrimary ? resumeData.url : (doc?.personalInfo?.resumeUrl || resumeData.url),
        },
      },
      { upsert: true, new: true }
    );

    await logAdminAction('create_resume', 'resumes', { id: resumeData.id, title: resumeData.title });

    return NextResponse.json({ success: true, resumes: updated.resumes });
  } catch (err) {
    console.error('Error adding resume:', err);
    return NextResponse.json({ error: 'Failed to add resume' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedResume: ResumeItem = await req.json();
    if (!updatedResume.id) {
      return NextResponse.json({ error: 'Missing resume id' }, { status: 400 });
    }

    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' });
    let existing = (doc?.resumes || []) as ResumeItem[];

    if (updatedResume.isPrimary) {
      existing = existing.map((r) => ({
        ...r,
        isPrimary: r.id === updatedResume.id,
      }));
    }

    existing = existing.map((r) => (r.id === updatedResume.id ? { ...r, ...updatedResume } : r));

    const primaryResume = existing.find((r) => r.isPrimary);

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      {
        $set: {
          resumes: existing,
          ...(primaryResume ? { 'personalInfo.resumeUrl': primaryResume.url } : {}),
        },
      },
      { upsert: true, new: true }
    );

    await logAdminAction('update_resume', 'resumes', { id: updatedResume.id, title: updatedResume.title });

    return NextResponse.json({ success: true, resumes: updated.resumes });
  } catch (err) {
    console.error('Error updating resume:', err);
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
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
    const existing = (doc?.resumes || []) as ResumeItem[];
    const target = existing.find((r) => r.id === id);

    if (target?.publicId) {
      // Clean up from Cloudinary
      try {
        await deleteMedia(target.publicId, 'raw');
      } catch (err) {
        console.warn('Non-blocking Cloudinary delete warning:', err);
      }
    }

    const filtered = existing.filter((r) => r.id !== id);

    // If deleted resume was primary and there are remaining resumes, make the first one primary
    if (target?.isPrimary && filtered.length > 0) {
      filtered[0].isPrimary = true;
    }

    const primaryResume = filtered.find((r) => r.isPrimary);

    const updated = await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      {
        $set: {
          resumes: filtered,
          'personalInfo.resumeUrl': primaryResume ? primaryResume.url : '',
        },
      },
      { upsert: true, new: true }
    );

    await logAdminAction('delete_resume', 'resumes', { id, title: target?.title });

    return NextResponse.json({ success: true, resumes: updated.resumes });
  } catch (err) {
    console.error('Error deleting resume:', err);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
