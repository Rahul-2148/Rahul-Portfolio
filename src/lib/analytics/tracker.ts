'use client';

export type ClientEventType =
  | 'page_view'
  | 'session_start'
  | 'project_view'
  | 'live_demo_click'
  | 'github_click'
  | 'resume_download'
  | 'resume_print'
  | 'contact_open'
  | 'contact_submit';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'pv_anon';
  try {
    let visitorId = localStorage.getItem('pv_guest_id');
    if (!visitorId) {
      visitorId = 'pv_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem('pv_guest_id', visitorId);
    }
    return visitorId;
  } catch {
    return 'pv_anon';
  }
}

export function trackEvent(
  eventType: ClientEventType,
  options: {
    projectSlug?: string;
    path?: string;
    metadata?: Record<string, unknown>;
  } = {}
) {
  if (typeof window === 'undefined') return;

  try {
    const visitorId = getOrCreateVisitorId();
    const currentPath = options.path || window.location.pathname;

    // Do not track internal admin or API requests
    if (currentPath.startsWith('/admin') || currentPath.startsWith('/api')) {
      return;
    }

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        eventType,
        path: currentPath,
        projectSlug: options.projectSlug || '',
        referrer: document.referrer || '',
        metadata: options.metadata || {},
      }),
      keepalive: true,
    }).catch(() => {
      // Non-blocking, fails silently in offline/restricted sandbox
    });
  } catch {
    // Fail safely
  }
}
