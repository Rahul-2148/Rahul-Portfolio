import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ProjectModel } from '@/lib/db/models/Project';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

    const project = await ProjectModel.findOne(query).lean();
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error('Error fetching single project:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

    // Prevent overwriting _id
    delete body._id;

    // If slug is being changed, ensure it does not collide with another project
    if (body.slug) {
      const slugCollision = await ProjectModel.findOne({
        slug: body.slug,
        ...(isObjectId ? { _id: { $ne: id } } : { slug: { $ne: id } }),
      });
      if (slugCollision) {
        return NextResponse.json(
          { error: `Slug "${body.slug}" is already in use by another project.` },
          { status: 400 }
        );
      }
    }

    const updated = await ProjectModel.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await logAdminAction('project_updated', updated.slug, {
      name: updated.name,
      status: updated.status,
      featured: updated.featured,
    });

    return NextResponse.json({
      success: true,
      message: `Project "${updated.name}" updated successfully.`,
      project: updated,
    });
  } catch (err) {
    console.error('Error updating project:', err);
    return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

    const deleted = await ProjectModel.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await logAdminAction('project_deleted', deleted.slug, { name: deleted.name });

    return NextResponse.json({
      success: true,
      message: `Project "${deleted.name}" removed successfully.`,
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
  }
}
