import React from 'react';

/**
 * High-fidelity branded SVGs with authentic default brand colors
 */

export function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3.14 8.78h3.6V20.2h-3.6V8.78zm5.78 0h3.45v1.56h.05c.48-.91 1.65-1.87 3.4-1.87 3.64 0 4.31 2.4 4.31 5.51v6.22h-3.6v-5.52c0-1.32-.03-3.01-1.84-3.01-1.84 0-2.12 1.43-2.12 2.92v5.61h-3.65V8.78z" />
    </svg>
  );
}

export function TwitterXIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InstagramIcon({
  className = 'w-4 h-4',
  colored = false,
}: {
  className?: string;
  colored?: boolean;
}) {
  if (colored) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ig-grad-icon" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <rect
          x="2.5"
          y="2.5"
          width="19"
          height="19"
          rx="5.5"
          stroke="url(#ig-grad-icon)"
          strokeWidth="2.2"
        />
        <circle
          cx="12"
          cy="12"
          r="4.2"
          stroke="url(#ig-grad-icon)"
          strokeWidth="2.2"
        />
        <circle
          cx="17.3"
          cy="6.7"
          r="1.3"
          fill="url(#ig-grad-icon)"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.2"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <circle
        cx="17.3"
        cy="6.7"
        r="1.3"
        fill="currentColor"
      />
    </svg>
  );
}

export function LeetcodeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Official LeetCode amber curve */}
      <path
        d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .271 4.735 5.762 5.762 0 0 0 4.137 2.846 5.86 5.86 0 0 0 2.247-.078 5.736 5.736 0 0 0 3.864-2.583l4.63-5.074a1.377 1.377 0 0 0-.074-1.921 1.377 1.377 0 0 0-1.92-.074l-4.63 5.074a3.003 3.003 0 0 1-2.022 1.352 3.064 3.064 0 0 1-1.176.041 3.013 3.013 0 0 1-2.164-1.488 2.89 2.89 0 0 1-.141-2.476c.104-.265.263-.586.448-.895l4.311-4.615 4.887-5.234a1.374 1.374 0 0 0-.966-2.333z"
        fill="#FFA116"
      />
      {/* White horizontal bar */}
      <path
        d="M8.783 13.06a1.377 1.377 0 0 0 0 2.754h11.234a1.377 1.377 0 0 0 0-2.754H8.783z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function CodeforcesIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Left bar: Yellow */}
      <rect x="3" y="9" width="4.5" height="12" rx="1.5" fill="#F3C742" />
      {/* Middle bar: Blue */}
      <rect x="9.75" y="3" width="4.5" height="18" rx="1.5" fill="#1878F3" />
      {/* Right bar: Red */}
      <rect x="16.5" y="12" width="4.5" height="9" rx="1.5" fill="#D23430" />
    </svg>
  );
}
