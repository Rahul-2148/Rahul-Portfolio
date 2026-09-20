import { MetadataRoute } from 'next';
import { projects } from '@/lib/data/portfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rahul-portfolio.vercel.app';

  const staticRoutes = [
    '',
    '/work',
    '/engineering',
    '/ai-lab',
    '/about',
    '/experience',
    '/resume',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: p.tier === 'S' ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
