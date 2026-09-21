import { connectToDatabase } from '@/lib/db/mongodb';
import { ProjectModel } from '@/lib/db/models/Project';
import { projects as defaultProjects } from '@/lib/data/portfolio';
import { Project } from '@/types';

export async function getProjectBySlug(slug: string, isPreview = false): Promise<Project | null> {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const query: Record<string, unknown> = { slug };
      if (!isPreview) {
        query.status = 'published';
      }

      const project = await ProjectModel.findOne(query).lean();
      if (project) {
        return project as unknown as Project;
      }
    }
  } catch (err) {
    console.error(`Error querying project ${slug} from database:`, err);
  }

  // Fallback to static data
  const staticMatch = defaultProjects.find((p) => p.slug === slug);
  if (staticMatch) {
    return staticMatch;
  }

  return null;
}
