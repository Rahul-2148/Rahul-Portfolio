import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import { uploadMedia } from '@/lib/cloudinary';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import { ResumeItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const uploadType = (formData.get('type') as string) || 'resume'; // 'resume' | 'avatar'
    const title = (formData.get('title') as string) || '';
    const category = (formData.get('category') as string) || 'General';
    const isPrimary = formData.get('isPrimary') === 'true';
    const description = (formData.get('description') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in upload request' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await connectToDatabase();

    if (uploadType === 'avatar') {
      const uploadRes = await uploadMedia(buffer, {
        folder: 'avatars',
        resourceType: 'image',
        filename: `rahul_avatar_${Date.now()}`,
      });

      // If an existing Cloudinary avatar was stored, clean it up to prevent orphaned files
      const currentDoc = await PortfolioModel.findOne({ docId: 'main' });
      if (
        currentDoc?.personalInfo?.avatarPublicId &&
        currentDoc.personalInfo.avatarPublicId !== uploadRes.publicId
      ) {
        try {
          const { deleteMedia } = await import('@/lib/cloudinary');
          await deleteMedia(currentDoc.personalInfo.avatarPublicId, 'image');
        } catch (cleanupErr) {
          console.warn('Old avatar cleanup non-fatal warning:', cleanupErr);
        }
      }

      // Update in Portfolio document
      await PortfolioModel.findOneAndUpdate(
        { docId: 'main' },
        {
          $set: {
            'personalInfo.avatarUrl': uploadRes.secureUrl,
            'personalInfo.avatarPublicId': uploadRes.publicId,
          },
        },
        { upsert: true, new: true }
      );

      await logAdminAction('upload_avatar', 'personalInfo', {
        url: uploadRes.secureUrl,
        publicId: uploadRes.publicId,
        provider: uploadRes.provider,
      });

      return NextResponse.json({
        success: true,
        message: 'Profile picture successfully uploaded and synchronized!',
        url: uploadRes.secureUrl,
        publicId: uploadRes.publicId,
        provider: uploadRes.provider,
      });
    }

    if (uploadType === 'project' || uploadType === 'project_image') {
      const projectSlug =
        (formData.get('projectSlug') as string) || (formData.get('slug') as string) || 'general';
      const cleanSlug = projectSlug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
      const folder = `portfolio/projects/${cleanSlug || 'general'}`;
      const cleanFilename = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_');

      const uploadRes = await uploadMedia(buffer, {
        folder,
        resourceType: 'image',
        filename: `${Date.now()}_${cleanFilename}`,
      });

      await logAdminAction('upload_project_image', 'project', {
        slug: cleanSlug,
        url: uploadRes.secureUrl,
        publicId: uploadRes.publicId,
        provider: uploadRes.provider,
        folder,
      });

      return NextResponse.json({
        success: true,
        message: 'Project image uploaded successfully!',
        url: uploadRes.secureUrl,
        publicId: uploadRes.publicId,
        provider: uploadRes.provider,
        folder,
        bytes: uploadRes.bytes,
        format: uploadRes.format,
      });
    }

    // Default: Resume upload
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uploadRes = await uploadMedia(buffer, {
      folder: 'resumes',
      resourceType: 'auto',
      filename: `resume_${Date.now()}_${cleanFilename}`,
    });

    const kbSize = (uploadRes.bytes / 1024).toFixed(0);
    const newResume: ResumeItem = {
      id: `resume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title || file.name.replace(/\.[^/.]+$/, ''),
      category: category || 'General',
      url: uploadRes.secureUrl,
      publicId: uploadRes.publicId,
      fileSize: `${kbSize} KB`,
      format: uploadRes.format || 'pdf',
      isPrimary: isPrimary,
      uploadedAt: new Date().toISOString(),
      description: description || `Uploaded technical resume (${category})`,
    };

    // If marked primary, unset other resumes' isPrimary
    const doc = await PortfolioModel.findOne({ docId: 'main' });
    let existingResumes = (doc?.resumes || []) as ResumeItem[];

    if (isPrimary) {
      existingResumes = existingResumes.map((r) => ({ ...r, isPrimary: false }));
    }

    // If this is the only resume, force primary to true
    if (existingResumes.length === 0) {
      newResume.isPrimary = true;
    }

    existingResumes.unshift(newResume);

    await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      {
        $set: {
          resumes: existingResumes,
          'personalInfo.resumeUrl': newResume.isPrimary ? newResume.url : doc?.personalInfo?.resumeUrl || newResume.url,
        },
      },
      { upsert: true, new: true }
    );

    await logAdminAction('upload_resume', 'resumes', {
      id: newResume.id,
      title: newResume.title,
      category: newResume.category,
      url: newResume.url,
      provider: uploadRes.provider,
    });

    return NextResponse.json({
      success: true,
      message: 'Resume successfully uploaded and synchronized with database!',
      resume: newResume,
      provider: uploadRes.provider,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error during upload';
    console.error('Cloudinary/Storage upload error:', err);
    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
