import { connectToDatabase } from '@/lib/db/mongodb';
import { ProjectModel } from '@/lib/db/models/Project';
import { SkillModel } from '@/lib/db/models/Skill';
import { PortfolioModel } from '@/lib/db/models/Portfolio';
import {
  projects as defaultProjects,
  skills as defaultSkills,
  experiences as defaultExperiences,
  personalInfo as defaultPersonalInfo,
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

export async function seedInitialPortfolioData(force = false) {
  const conn = await connectToDatabase();
  if (!conn) {
    return { success: false, message: 'MongoDB Atlas is not connected.' };
  }

  const existingProjectCount = await ProjectModel.countDocuments();
  if (existingProjectCount > 0 && !force) {
    return {
      success: true,
      message: 'Projects already seeded.',
      projectCount: existingProjectCount,
    };
  }

  // 1. Seed Projects
  const projectOps = defaultProjects.map((p, index) => {
    return {
      updateOne: {
        filter: { slug: p.slug },
        update: {
          $set: {
            slug: p.slug,
            name: p.name,
            tagline: p.tagline,
            description: p.description,
            category: p.category,
            tier: p.tier,
            type: p.type || 'Web Application',
            status: 'published' as const,
            featured: p.tier === 'S',
            sortOrder: index,
            technologies: p.technologies || [],
            features: p.features || [],
            links: p.links || {},
            image: p.image || '',
            gallery: p.image ? [p.image] : [],
            color: p.color || '#00f0ff',
            year: p.year || '2025',
            role: p.role || 'Lead Engineer',
            isPrivate: p.isPrivate || false,
            architecture: p.architecture || [],
            challenges: p.challenges || [],
            decisions: p.decisions || [],
            metrics: p.metrics || [],
            caseStudyContent: {
              overview: p.description,
              problem: p.challenges?.[0]?.problem || '',
              goals: p.features?.slice(0, 3) || [],
              solutions: p.challenges?.[0]?.solution || '',
              lessonsLearned: p.decisions?.map((d) => `${d.decision}: ${d.result}`) || [],
            },
            seo: {
              metaTitle: `${p.name} — ${p.tagline}`,
              metaDescription: p.description,
              ogImage: p.image || '',
            },
          },
        },
        upsert: true,
      },
    };
  });

  if (projectOps.length > 0) {
    await ProjectModel.bulkWrite(projectOps);
  }

  // 2. Seed Skills
  const skillOps = defaultSkills.map((s, index) => {
    const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
      updateOne: {
        filter: { slug },
        update: {
          $set: {
            name: s.name,
            slug,
            category: s.category,
            level: s.level,
            projects: s.projects || [],
            description: s.description || '',
            color: '#00f0ff',
            sortOrder: index,
            active: true,
          },
        },
        upsert: true,
      },
    };
  });

  if (skillOps.length > 0) {
    await SkillModel.bulkWrite(skillOps);
  }

  // 3. Upsert legacy Portfolio singleton for zero disruption
  await PortfolioModel.findOneAndUpdate(
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

  return {
    success: true,
    message: `Successfully seeded ${defaultProjects.length} projects and ${defaultSkills.length} skills into MongoDB Atlas!`,
    projectCount: defaultProjects.length,
    skillCount: defaultSkills.length,
  };
}
