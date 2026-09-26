'use client';

import React from 'react';

interface ResumeModalTriggerProps {
  children: React.ReactNode;
  className?: string;
  category?: string;
}

export function ResumeModalTrigger({ children, className, category }: ResumeModalTriggerProps) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent('open-resume-modal', { detail: { category } })
        )
      }
      className={className}
    >
      {children}
    </button>
  );
}

export default ResumeModalTrigger;
