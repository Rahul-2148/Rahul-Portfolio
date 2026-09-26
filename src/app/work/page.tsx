import React from 'react';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ArchitectureVisualizer } from '@/components/sections/ArchitectureVisualizer';

export const metadata = {
  title: 'Selected Work & Systems',
  description:
    'Curated engineering projects, distributed platforms, and real-time architectures built by Rahul Raj.',
};

export default function WorkPage() {
  return (
    <div className="pb-10 sm:pb-12 flex flex-col">
      <SelectedWork isHomePage={false} />
      <ArchitectureVisualizer />
    </div>
  );
}
