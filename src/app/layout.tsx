import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { ClientShell } from '@/components/providers/ClientShell';
import { VisitorTracker } from '@/components/interactive/VisitorTracker';
import { personalInfo } from '@/lib/data/portfolio';

export const metadata: Metadata = {
  title: {
    default: `${personalInfo.name} — ${personalInfo.role}`,
    template: `%s | ${personalInfo.name}`,
  },
  description: personalInfo.bio,
  keywords: [
    'Rahul Raj',
    'Full-Stack Engineer',
    'Software Architect',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'Socket.IO',
    'AI Engineer',
    'Real-time Systems',
  ],
  authors: [{ name: personalInfo.name }],
  creator: personalInfo.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: `${personalInfo.name} — Engineering Portfolio`,
    title: `${personalInfo.name} — ${personalInfo.role}`,
    description: personalInfo.bio,
    url: 'https://rahul-portfolio.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${personalInfo.name} — ${personalInfo.role}`,
    description: personalInfo.bio,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="cyber-cyan" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: personalInfo.name,
              url: 'https://rahul-portfolio.vercel.app',
              jobTitle: personalInfo.role,
              description: personalInfo.bio,
              sameAs: [personalInfo.github],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rahul-portfolio-theme')||'cyber-cyan';document.documentElement.setAttribute('data-theme',t);if(t==='studio-light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}else{document.documentElement.classList.remove('light');document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased transition-colors duration-300" suppressHydrationWarning>
        <ClientShell>
          <VisitorTracker />
          <Navigation />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </ClientShell>
      </body>
    </html>
  );
}
