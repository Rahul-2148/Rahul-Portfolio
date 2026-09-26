import { NextRequest } from 'next/server';
import crypto from 'crypto';
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
  // Strictly environment-only; zero hardcoded fallback credentials
  return process.env.ADMIN_PASSCODE ? process.env.ADMIN_PASSCODE.trim() : '';
}

export function generateAdminSessionToken(passcode: string): string {
  // Cryptographically secure token derived from passcode + secret salt
  const secretSalt = process.env.ADMIN_PASSCODE || 'rahul_portfolio_secure_session_salt';
  const hash = crypto
    .createHmac('sha256', secretSalt)
    .update(passcode)
    .digest('hex');
  return `auth_v2_${hash}`;
}

export async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  const cookieToken = req.cookies.get('portfolio_admin_token')?.value;
  const headerToken = req.headers.get('x-admin-passcode');

  const passcode = await getEffectiveAdminPasscode();
  if (!passcode || passcode.length < 4) {
    // If no passcode is set in environment or database, refuse access safely
    return false;
  }

  const expectedToken = generateAdminSessionToken(passcode);
  // Also support backwards-compatible base64 session token during transition
  const legacyToken = 'authenticated_' + Buffer.from(passcode).toString('base64');

  if (cookieToken === expectedToken || cookieToken === legacyToken) return true;
  if (headerToken === passcode) return true;

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
