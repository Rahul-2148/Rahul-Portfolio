'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip tracking for admin and api routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    // Debounce duplicate tracking on the same path
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    try {
      // Get or create persistent visitor ID
      let visitorId = localStorage.getItem('pv_guest_id');
      if (!visitorId) {
        visitorId = 'pv_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
        localStorage.setItem('pv_guest_id', visitorId);
      }

      // Send non-blocking beacon to telemetry endpoint
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          path: pathname,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }),
        keepalive: true,
      }).catch(() => {
        // Silently fail if offline
      });
    } catch {
      // Ignore in restricted environments
    }
  }, [pathname]);

  return null;
}
