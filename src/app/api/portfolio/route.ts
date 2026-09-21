import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import {
  personalInfo as defaultPersonalInfo,
  projects as defaultProjects,
  experiences as defaultExperiences,
  skills as defaultSkills,
} from '@/lib/data/portfolio';

export const revalidate = 60; // ISR cache for 60 seconds

export async function GET() {
  try {
    const mongooseConn = await connectToDatabase();
    if (!mongooseConn) {
      return NextResponse.json({
        source: 'static_fallback',
        data: {
          personalInfo: defaultPersonalInfo,
          projects: defaultProjects,
          experiences: defaultExperiences,
          skills: defaultSkills,
        },
      });
    }

    const doc = await PortfolioModel.findOne({ docId: 'main' }).lean();

    if (!doc) {
      return NextResponse.json({
        source: 'static_fallback',
        data: {
          personalInfo: defaultPersonalInfo,
          projects: defaultProjects,
          experiences: defaultExperiences,
          skills: defaultSkills,
        },
      });
    }

    return NextResponse.json({
      source: 'mongodb_atlas',
      data: {
        personalInfo: doc.personalInfo || defaultPersonalInfo,
        projects: doc.projects || defaultProjects,
        experiences: doc.experiences || defaultExperiences,
        educations: doc.educations || [],
        skills: doc.skills || defaultSkills,
      },
    });
  } catch (err) {
    console.error('Public portfolio fetch error:', err);
    return NextResponse.json({
      source: 'static_fallback',
      data: {
        personalInfo: defaultPersonalInfo,
        projects: defaultProjects,
        experiences: defaultExperiences,
        skills: defaultSkills,
      },
    });
  }
}
