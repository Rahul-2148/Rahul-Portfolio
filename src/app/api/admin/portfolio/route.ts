import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import { checkAdminAuth } from '@/lib/auth/adminAuth';
import {
  personalInfo as defaultPersonalInfo,
  projects as defaultProjects,
  experiences as defaultExperiences,
  skills as defaultSkills,
} from '@/lib/data/portfolio';

export async function GET(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const mongooseConn = await connectToDatabase();
    const isConnected = Boolean(mongooseConn);

    const {
      resumes: defaultResumes,
      achievements: defaultAchievements,
    } = await import('@/lib/data/portfolio');

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
          educations: [],
          skills: defaultSkills,
          resumes: defaultResumes,
          achievements: defaultAchievements,
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
          educations: [],
          skills: defaultSkills,
          resumes: defaultResumes,
          achievements: defaultAchievements,
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
        educations: doc.educations || [],
        skills: doc.skills || defaultSkills,
        resumes: doc.resumes || [],
        achievements: doc.achievements || [],
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
          educations: [],
          skills: defaultSkills,
        },
      },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
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
