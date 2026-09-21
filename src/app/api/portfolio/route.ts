import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ProjectModel } from '@/lib/db/models/Project';
import { SkillModel } from '@/lib/db/models/Skill';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import {
  personalInfo as defaultPersonalInfo,
  projects as defaultProjects,
  experiences as defaultExperiences,
  skills as defaultSkills,
} from '@/lib/data/portfolio';
import { seedInitialPortfolioData } from '@/lib/db/seed';

export const dynamic = 'force-dynamic';

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

    // Auto-seed if empty
    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      await seedInitialPortfolioData();
    }

    const [publishedProjects, activeSkills, portfolioDoc] = await Promise.all([
      ProjectModel.find({ status: 'published' }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
      SkillModel.find({ active: true }).sort({ category: 1, sortOrder: 1, name: 1 }).lean(),
      PortfolioModel.findOne({ docId: 'main' }).lean(),
    ]);

    const projectsToServe = publishedProjects.length > 0 ? publishedProjects : defaultProjects;
    const skillsToServe = activeSkills.length > 0 ? activeSkills : defaultSkills;

    return NextResponse.json({
      source: 'mongodb_atlas',
      data: {
        personalInfo: portfolioDoc?.personalInfo || defaultPersonalInfo,
        projects: projectsToServe,
        experiences: portfolioDoc?.experiences || defaultExperiences,
        educations: portfolioDoc?.educations || [],
        skills: skillsToServe,
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
