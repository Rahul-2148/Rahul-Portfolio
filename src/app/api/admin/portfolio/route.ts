import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import {
  personalInfo as defaultPersonalInfo,
  projects as defaultProjects,
  experiences as defaultExperiences,
  skills as defaultSkills,
} from '@/lib/data/portfolio';
import { Education } from '@/types';

const defaultEducations: Education[] = [
  {
    institution: 'APJ Abdul Kalam Technological University',
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering',
    duration: '2021 — 2025',
    score: 'First Class with Distinction',
    location: 'India',
    achievements: [
      'Core coursework: Data Structures, Distributed Systems, Database Management Systems, Computer Networks, AI Systems',
      'Architected full-stack event systems and multi-portal micro-frontends',
    ],
  },
];

function checkAuth(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('portfolio_admin_token')?.value;
  const headerToken = req.headers.get('x-admin-passcode');
  const correctPasscode = process.env.ADMIN_PASSCODE || 'rahul2148';
  const expectedToken = 'authenticated_' + Buffer.from(correctPasscode).toString('base64');

  if (cookieToken === expectedToken) return true;
  if (headerToken === correctPasscode) return true;
  return false;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const mongooseConn = await connectToDatabase();
    const isConnected = Boolean(mongooseConn);

    if (!isConnected) {
      return NextResponse.json({
        isConnected: false,
        isSynced: false,
        source: 'static_fallback',
        message: 'MongoDB Atlas is not configured yet. Running in offline/fallback mode.',
        data: {
          personalInfo: defaultPersonalInfo,
          projects: defaultProjects,
          experiences: defaultExperiences,
          educations: defaultEducations,
          skills: defaultSkills,
        },
      });
    }

    const doc = await PortfolioModel.findOne({ docId: 'main' }).lean();

    if (!doc) {
      return NextResponse.json({
        isConnected: true,
        isSynced: false,
        source: 'static_defaults',
        message: 'Connected to MongoDB Atlas! Click "Sync Initial Data" to seed database.',
        data: {
          personalInfo: defaultPersonalInfo,
          projects: defaultProjects,
          experiences: defaultExperiences,
          educations: defaultEducations,
          skills: defaultSkills,
        },
      });
    }

    return NextResponse.json({
      isConnected: true,
      isSynced: true,
      source: 'mongodb_atlas',
      message: 'Connected to MongoDB Atlas. Live data loaded.',
      data: {
        personalInfo: doc.personalInfo || defaultPersonalInfo,
        projects: doc.projects || defaultProjects,
        experiences: doc.experiences || defaultExperiences,
        educations: doc.educations || defaultEducations,
        skills: doc.skills || defaultSkills,
      },
    });
  } catch (err) {
    console.error('Error fetching admin portfolio:', err);
    return NextResponse.json(
      {
        isConnected: false,
        source: 'static_fallback',
        error: 'Database query failed. Serving default static data.',
        data: {
          personalInfo: defaultPersonalInfo,
          projects: defaultProjects,
          experiences: defaultExperiences,
          educations: defaultEducations,
          skills: defaultSkills,
        },
      },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, section, data } = body;

    const mongooseConn = await connectToDatabase();
    const isConnected = Boolean(mongooseConn);

    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          isConnected: false,
          message:
            'MongoDB Atlas is not connected. Add MONGODB_URI in .env.local to persist changes in the cloud.',
        },
        { status: 400 }
      );
    }

    if (action === 'sync_initial') {
      const updated = await PortfolioModel.findOneAndUpdate(
        { docId: 'main' },
        {
          $set: {
            personalInfo: defaultPersonalInfo,
            projects: defaultProjects,
            experiences: defaultExperiences,
            educations: defaultEducations,
            skills: defaultSkills,
          },
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        success: true,
        message: 'Successfully seeded all portfolio projects and details into MongoDB Atlas!',
        data: updated,
      });
    }

    if (action === 'update_section' && section) {
      const updateQuery: Record<string, unknown> = {};
      updateQuery[section] = data;

      const updated = await PortfolioModel.findOneAndUpdate(
        { docId: 'main' },
        { $set: updateQuery },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        success: true,
        message: `Successfully updated ${section} in MongoDB Atlas!`,
        data: updated,
      });
    }

    // Full portfolio payload save
    if (data) {
      const updated = await PortfolioModel.findOneAndUpdate(
        { docId: 'main' },
        { $set: data },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        success: true,
        message: 'Successfully saved all changes to MongoDB Atlas!',
        data: updated,
      });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (err) {
    console.error('Error updating admin portfolio:', err);
    return NextResponse.json(
      { error: 'Failed to update portfolio data in MongoDB.' },
      { status: 500 }
    );
  }
}
