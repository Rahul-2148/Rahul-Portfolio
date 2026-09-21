'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getOrCreateVisitorId } from '@/lib/analytics/tracker';

function detectDeviceAndBrowser() {
  if (typeof window === 'undefined') {
    return { device: 'desktop', browser: 'unknown' };
  }
  const ua = navigator.userAgent || '';
  const uaLower = ua.toLowerCase();

  let device = 'desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(uaLower)) {
    device = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(uaLower)) {
    device = 'mobile';
  }

  let browser = 'Other';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  return { device, browser };
}

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  // 1. Route change telemetry (page_view and project_view)
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    try {
      const visitorId = getOrCreateVisitorId();
      const referrer = typeof document !== 'undefined' ? document.referrer : '';

      // Check if viewing a specific project
      const isWorkRoute = pathname.startsWith('/work/');
      const projectSlug = isWorkRoute ? pathname.replace('/work/', '').split('/')[0] : undefined;

      // Send page view
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          eventType: projectSlug ? 'project_view' : 'page_view',
          path: pathname,
          projectSlug,
          referrer,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Ignore
    }
  }, [pathname]);

  // 2. Real-Time Presence Heartbeat (Every 18s while active)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/api'))) {
      return;
    }

    const sendHeartbeat = () => {
      // Only send if page is currently visible
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }

      try {
        const visitorId = getOrCreateVisitorId();
        const { device, browser } = detectDeviceAndBrowser();

        fetch('/api/analytics/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            path: pathname || '/',
            device,
            browser,
            referrer: typeof document !== 'undefined' ? document.referrer : '',
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {
        // Ignore
      }
    };

    // Send initial heartbeat
    sendHeartbeat();

    // Pulse every 18 seconds
    const interval = setInterval(sendHeartbeat, 18000);

    // Send heartbeat when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}
