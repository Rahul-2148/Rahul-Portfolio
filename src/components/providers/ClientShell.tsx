'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ThemeBackgroundCanvas } from '@/components/interactive/ThemeBackgroundCanvas';

// Lightweight deferred client overlays
const CustomCursor = dynamic(
  () => import('@/components/interactive/CustomCursor').then((m) => m.CustomCursor),
  { ssr: false }
);

const AiChatWidget = dynamic(
  () => import('@/components/interactive/AiChatWidget').then((m) => m.AiChatWidget),
  { ssr: false }
);

// High-impact On-Demand code splitting: Heavy overlays (2,200+ lines of JS) are
// ONLY fetched and mounted when the user actually triggers them!
const CommandPalette = dynamic(
  () => import('@/components/interactive/CommandPalette').then((m) => m.CommandPalette),
  { ssr: false }
);

const DeveloperTerminal = dynamic(
  () => import('@/components/interactive/DeveloperTerminal').then((m) => m.DeveloperTerminal),
  { ssr: false }
);

const ResumeModal = dynamic(
  () => import('@/components/interactive/ResumeModal').then((m) => m.ResumeModal),
  { ssr: false }
);

export function ClientShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // On-demand mount states for heavy overlays
  const [loadCommandPalette, setLoadCommandPalette] = useState(false);
  const [loadTerminal, setLoadTerminal] = useState(false);
  const [loadResumeModal, setLoadResumeModal] = useState(false);
  const [resumeDetail, setResumeDetail] = useState<{ resumeId?: string; category?: string } | null>(null);

  useEffect(() => {
    // Defer non-critical UI overlays to idle time to prioritize initial page render & navigation
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => setMounted(true), { timeout: 200 });
    } else {
      setTimeout(() => setMounted(true), 50);
    }
  }, []);

  // Global listeners to load heavy overlays strictly on demand
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin Hotkey: Ctrl + Shift + A or Cmd + Shift + A
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        router.push('/admin');
        return;
      }
      // Command palette trigger
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        setLoadCommandPalette(true);
      }
      // Developer terminal trigger
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        setLoadTerminal(true);
      }
    };

    const handleOpenCommandPalette = () => {
      setLoadCommandPalette(true);
    };

    const handleToggleTerminal = () => {
      setLoadTerminal(true);
    };

    const handleOpenResume = (e: Event) => {
      const customEvent = e as CustomEvent<{ resumeId?: string; category?: string }>;
      if (customEvent.detail) {
        setResumeDetail(customEvent.detail);
      }
      setLoadResumeModal(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenCommandPalette);
    window.addEventListener('toggle-terminal', handleToggleTerminal);
    window.addEventListener('open-resume-modal', handleOpenResume);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenCommandPalette);
      window.removeEventListener('toggle-terminal', handleToggleTerminal);
      window.removeEventListener('open-resume-modal', handleOpenResume);
    };
  }, []);

  return (
    <>
      <ThemeBackgroundCanvas />
      {children}
      {mounted && (
        <>
          <CustomCursor />
          <AiChatWidget />
        </>
      )}
      {loadCommandPalette && <CommandPalette initialOpen={true} />}
      {loadTerminal && <DeveloperTerminal initialOpen={true} />}
      {loadResumeModal && <ResumeModal initialOpen={true} initialDetail={resumeDetail} />}
    </>
  );
}
