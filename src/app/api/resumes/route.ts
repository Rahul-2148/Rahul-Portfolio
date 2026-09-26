import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, resumes: [] });
    }

    const doc = await PortfolioModel.findOne({ docId: 'main' }).select('resumes personalInfo').lean();
    if (doc?.resumes && Array.isArray(doc.resumes) && doc.resumes.length > 0) {
      return NextResponse.json({ success: true, resumes: doc.resumes });
    }

    return NextResponse.json({ success: true, resumes: [] });
  } catch (err) {
    console.error('Error in public resumes API:', err);
    return NextResponse.json({ success: true, resumes: [] });
  }
}
