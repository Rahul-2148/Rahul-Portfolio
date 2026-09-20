'use client';

import React, { useEffect, useState } from 'react';
import { CommandPalette } from '@/components/interactive/CommandPalette';
import { CustomCursor } from '@/components/interactive/CustomCursor';
import { DeveloperTerminal } from '@/components/interactive/DeveloperTerminal';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {children}
      {mounted && (
        <>
          <CommandPalette />
          <CustomCursor />
          <DeveloperTerminal />
        </>
      )}
    </>
  );
}
