import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ProjectModel } from '@/lib/db/models/Project';
import { checkAdminAuth, logAdminAction } from '@/lib/auth/adminAuth';
import { seedInitialPortfolioData } from '@/lib/db/seed';

export async function GET(req: NextRequest) {
  const isAuth = await checkAdminAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: 'MongoDB Atlas is not connected.' },
        { status: 503 }
      );
    }

    // Auto seed if empty
    const count = await ProjectModel.countDocuments();
    if (count === 0) {
      await seedInitialPortfolioData();
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const query: Record<string, unknown> = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { slug: regex },
        { tagline: regex },
        { description: regex },
        { technologies: regex },
      ];
    }

    const projects = await ProjectModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();

    // Calculate status counts
    const [publishedCount, draftCount, archivedCount] = await Promise.all([
      ProjectModel.countDocuments({ status: 'published' }),
      ProjectModel.countDocuments({ status: 'draft' }),
      ProjectModel.countDocuments({ status: 'archived' }),
    ]);

    return NextResponse.json({
      success: true,
      projects,
      counts: {
        total: projects.length,
        published: publishedCount,
        draft: draftCount,
        archived: archivedCount,
      },
    });
  } catch (err) {
    console.error('Error fetching admin projects:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve projects from database.' },
      { status: 500 }
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
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 503 });
    }

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Project name is required.' }, { status: 400 });
    }

    const name = body.name.trim();
    let slug = body.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) slug = 'project-' + Date.now();

    // Check slug uniqueness
    const existing = await ProjectModel.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Determine sort order
    let sortOrder = body.sortOrder;
    if (typeof sortOrder !== 'number') {
      const highest = await ProjectModel.findOne().sort({ sortOrder: -1 }).select('sortOrder').lean();
      sortOrder = (highest?.sortOrder ?? -1) + 1;
    }

    const newProject = await ProjectModel.create({
      slug,
      name,
      tagline: body.tagline || '',
      description: body.description || '',
      category: body.category || 'Full Stack',
      tier: body.tier || 'A',
      type: body.type || 'Web Application',
      status: body.status || 'published',
      featured: Boolean(body.featured),
      sortOrder,
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      features: Array.isArray(body.features) ? body.features : [],
      links: body.links || { live: '', github: '', caseStudy: '' },
      image: body.image || '',
      gallery: Array.isArray(body.gallery) ? body.gallery : body.image ? [body.image] : [],
      heroImage: body.heroImage || '',
      videoUrl: body.videoUrl || '',
      color: body.color || '#00f0ff',
      year: body.year || new Date().getFullYear().toString(),
      role: body.role || 'Lead Engineer',
      isPrivate: Boolean(body.isPrivate),
      architecture: Array.isArray(body.architecture) ? body.architecture : [],
      challenges: Array.isArray(body.challenges) ? body.challenges : [],
      decisions: Array.isArray(body.decisions) ? body.decisions : [],
      metrics: Array.isArray(body.metrics) ? body.metrics : [],
      caseStudyContent: body.caseStudyContent || {
        overview: body.description || '',
        problem: '',
        goals: [],
        solutions: '',
        lessonsLearned: [],
      },
      seo: body.seo || {
        metaTitle: `${name} — ${body.tagline || ''}`,
        metaDescription: body.description || '',
        ogImage: body.image || '',
      },
      stats: { views: 0, uniqueVisitors: 0, liveClicks: 0, githubClicks: 0 },
    });

    await logAdminAction('project_created', slug, { name, status: newProject.status });

    return NextResponse.json({
      success: true,
      message: `Project "${name}" created successfully.`,
      project: newProject,
    });
  } catch (err) {
    console.error('Error creating project:', err);
    return NextResponse.json(
      { error: 'Failed to create project.' },
      { status: 500 }
    );
  }
}
