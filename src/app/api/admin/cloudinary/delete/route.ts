import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import { deleteMedia } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { publicId, publicIds, resourceType = 'image' } = body;

    // Bulk deletion support (Delete All)
    if (Array.isArray(publicIds) && publicIds.length > 0) {
      const results = await Promise.all(
        publicIds.map(async (id: string) => {
          if (!id) return { success: false, id };
          const res = await deleteMedia(id, resourceType);
          return { ...res, id };
        })
      );

      await logAdminAction('bulk_delete_cloudinary_media', 'cloudinary', {
        count: publicIds.length,
        deletedCount: results.filter((r) => r.success).length,
      });

      return NextResponse.json({
        success: true,
        message: `Deleted ${results.filter((r) => r.success).length} assets.`,
        results,
      });
    }

    if (!publicId) {
      return NextResponse.json({ error: 'Missing publicId or publicIds' }, { status: 400 });
    }

    const result = await deleteMedia(publicId, resourceType);

    await logAdminAction('delete_cloudinary_media', 'cloudinary', {
      publicId,
      resourceType,
      result,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error during deletion';
    console.error('Delete media error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
