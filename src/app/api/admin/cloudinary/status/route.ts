import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/adminAuth';
import { verifyCloudinaryConnection, isCloudinaryConfigured } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const isConfigured = isCloudinaryConfigured();
    const status = await verifyCloudinaryConnection();

    return NextResponse.json({
      success: true,
      isConfigured,
      ...status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Status check failed';
    return NextResponse.json(
      {
        success: false,
        isConfigured: false,
        connected: false,
        message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const isAuthorized = await checkAdminAuth(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cloudName, apiKey, apiSecret } = await req.json();

    const { configureCloudinary } = await import('@/lib/cloudinary');
    const { connectToDatabase } = await import('@/lib/db/mongodb');
    const { PortfolioModel } = await import('@/lib/db/models/Portfolio');
    const { logAdminAction } = await import('@/lib/auth/adminAuth');

    await connectToDatabase();

    await PortfolioModel.findOneAndUpdate(
      { docId: 'main' },
      {
        $set: {
          cloudinary: {
            cloudName: cloudName || '',
            apiKey: apiKey || '',
            apiSecret: apiSecret || '',
          },
        },
      },
      { upsert: true, new: true }
    );

    configureCloudinary({ cloudName, apiKey, apiSecret });

    const status = await verifyCloudinaryConnection();

    await logAdminAction('configure_cloudinary', 'cloudinary', {
      cloudName,
      connected: status.connected,
    });

    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update Cloudinary configuration';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
