import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import { AuditLogModel } from '@/lib/db/models/AuditLog';

export async function getEffectiveAdminPasscode(): Promise<string> {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const doc = await PortfolioModel.findOne({ docId: 'main' }).select('security').lean();
      if (doc?.security?.customPasscode && doc.security.customPasscode.trim().length > 0) {
        return doc.security.customPasscode.trim();
      }
    }
  } catch (err) {
    console.error('Error fetching dynamic admin passcode:', err);
  }
  return process.env.ADMIN_PASSCODE || 'rahul2148';
}

export async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  const cookieToken = req.cookies.get('portfolio_admin_token')?.value;
  const headerToken = req.headers.get('x-admin-passcode');

  const passcode = await getEffectiveAdminPasscode();
  const expectedToken = 'authenticated_' + Buffer.from(passcode).toString('base64');

  if (cookieToken === expectedToken) return true;
  if (headerToken === passcode) return true;

  // Fallback to initial env passcode if user passcode was updated
  const defaultPasscode = process.env.ADMIN_PASSCODE || 'rahul2148';
  if (cookieToken === 'authenticated_' + Buffer.from(defaultPasscode).toString('base64')) {
    return true;
  }
  if (headerToken === defaultPasscode) {
    return true;
  }

  return false;
}

export async function logAdminAction(
  action: string,
  resource: string,
  details?: Record<string, unknown>
) {
  try {
    if (!process.env.MONGODB_URI) return;
    await connectToDatabase();
    await AuditLogModel.create({
      action,
      resource,
      details: details || {},
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
