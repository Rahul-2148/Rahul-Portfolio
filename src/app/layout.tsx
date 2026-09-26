import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@/styles/globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { ClientShell } from '@/components/providers/ClientShell';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { VisitorTracker } from '@/components/interactive/VisitorTracker';
import { personalInfo } from '@/lib/data/portfolio';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#08090d' },
    { media: '(prefers-color-scheme: light)', color: '#f8f9fc' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: `${personalInfo.name} — Full-Stack Engineer`,
    template: `%s | ${personalInfo.name}`,
  },
  description: `${personalInfo.name} — Full-Stack Engineer specializing in AI, distributed systems, and real-time event platforms.`,
  keywords: [
    'Rahul Raj',
    'Full-Stack Engineer',
    'Distributed Systems',
    'Next.js',
    'TypeScript',
    'React',
    'Node.js',
    'Socket.IO',
    'MongoDB',
    'Redis',
    'AI Engineer',
  ],
  authors: [{ name: personalInfo.name }],
  creator: personalInfo.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: `${personalInfo.name} — Engineering Portfolio`,
    title: `${personalInfo.name} — Full-Stack Engineer`,
    description: personalInfo.bio,
    url: 'https://rahul-portfolio.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${personalInfo.name} — Full-Stack Engineer`,
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
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rahul-portfolio-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}var d=document.documentElement;d.setAttribute('data-theme',t);if(t==='light'){d.classList.remove('dark');d.classList.add('light');}else{d.classList.remove('light');d.classList.add('dark');}}catch(e){}})();`,
          }}
        />
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
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: personalInfo.name,
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rahul-portfolio.vercel.app',
              jobTitle: personalInfo.role,
              description: personalInfo.bio,
              sameAs: [personalInfo.github],
            }),
          }}
        />
      </head>
      <body
        className="bg-background text-foreground antialiased min-h-screen selection:bg-primary/20 selection:text-foreground"
        suppressHydrationWarning
      >
        <LenisProvider>
          <ClientShell>
            <VisitorTracker />
            <Navigation />
            <main className="min-h-screen pt-16">{children}</main>
            <Footer />
          </ClientShell>
        </LenisProvider>
      </body>
    </html>
  );
}
