'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Radio,
  ExternalLink,
  Clock,
  Eye,
  FileDown,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

interface ActiveSession {
  id: string;
  visitorIdShort: string;
  path: string;
  device: string;
  browser: string;
  referrer: string;
  secondsAgo: number;
}

interface RealtimeEvent {
  id: string;
  eventType: string;
  path: string;
  projectSlug?: string;
  visitorIdShort: string;
  device: string;
  browser: string;
  referrer: string;
  timestamp: string;
  secondsAgo: number;
}

export function LiveVisitorsView() {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRealtimeData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/admin/analytics/realtime');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setOnlineCount(data.onlineCount || 0);
        setActiveSessions(data.activeSessions || []);
        setRecentEvents(data.recentEvents || []);
        setLastSync(new Date());
      }
    } catch {
      // Silently fail on network disconnect
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRealtimeData();
    // Auto refresh every 4 seconds for true real-time visibility
    const interval = setInterval(fetchRealtimeData, 4000);
    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (device: string) => {
    switch (device?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5 text-primary" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5 text-primary" />;
      default:
        return <Laptop className="w-3.5 h-3.5 text-primary" />;
    }
  };

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'github_click':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-foreground border border-border text-[10px] font-mono">
            <GithubIcon className="w-3 h-3" />
            <span>GitHub Click</span>
          </span>
        );
      case 'live_demo_click':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-[10px] font-mono font-bold">
            <ExternalLink className="w-3 h-3" />
            <span>Try Now Launch</span>
          </span>
        );
      case 'resume_download':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
            <FileDown className="w-3 h-3" />
            <span>Resume Download</span>
          </span>
        );
      case 'contact_submit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold">
            <Mail className="w-3 h-3" />
            <span>Contact Inquiry</span>
          </span>
        );
      case 'project_view':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono">
            <Eye className="w-3 h-3" />
            <span>Project View</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-elevated text-muted-foreground border border-border text-[10px] font-mono">
            <Globe className="w-3 h-3" />
            <span>Page View</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Live Radar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Real-Time Presence Engine
            </span>
          </div>

          <div className="flex items-baseline gap-4 pt-1">
            <h1 className="text-4xl sm:text-6xl font-black text-foreground font-mono tracking-tight">
              {onlineCount}
            </h1>
            <span className="text-lg sm:text-xl font-mono text-muted-foreground">
              {onlineCount === 1 ? 'visitor active right now' : 'visitors active right now'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Live presence is verified via lightweight browser heartbeats sent every 18 seconds with a 45-second TTL. Active sessions drop immediately upon disconnect.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-surface border border-border px-4 py-3 rounded-2xl shrink-0 text-xs font-mono">
          <Radio className={`w-4 h-4 ${isRefreshing ? 'text-primary animate-spin' : 'text-emerald-400'}`} />
          <div>
            <div className="text-foreground font-semibold">Live Polling Active (4s)</div>
            <div className="text-muted-foreground text-[11px]">
              Last sync: {lastSync.toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={fetchRealtimeData}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Force refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Visitors Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Active Browsing Sessions ({activeSessions.length})</span>
            </h3>
            <span className="text-xs font-mono text-muted-foreground">Threshold: &lt;45s heartbeat</span>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {activeSessions.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Globe className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
                <p className="text-sm font-mono text-muted-foreground">No visitors currently on site.</p>
                <p className="text-xs text-muted-foreground/70">
                  Open the portfolio in an incognito tab to watch your live session appear here!
                </p>
              </div>
            ) : (
              <div
                data-lenis-prevent
                className="overflow-x-auto touch-pan-x overscroll-contain"
              >
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface border-b border-border text-muted-foreground uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Visitor</th>
                      <th className="py-3 px-4">Active Route</th>
                      <th className="py-3 px-4">Device / Browser</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4 text-right">Heartbeat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activeSessions.map((session, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="py-3 px-4 text-foreground font-bold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>#{session.visitorIdShort}</span>
                        </td>
                        <td className="py-3 px-4 text-primary truncate max-w-xs font-semibold">
                          {session.path}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            {getDeviceIcon(session.device)}
                            <span className="capitalize">{session.device}</span>
                            <span>•</span>
                            <span>{session.browser}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground truncate max-w-[120px]">
                          {session.referrer}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                          {session.secondsAgo === 0 ? 'just now' : `${session.secondsAgo}s ago`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Activity Stream (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Live Activity Stream</span>
            </h3>
            <span className="text-xs font-mono text-muted-foreground">Last {recentEvents.length} events</span>
          </div>

          <div
            data-lenis-prevent
            className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm max-h-[520px] overflow-y-auto overscroll-contain touch-pan-y"
          >
            {recentEvents.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-muted-foreground text-xs font-mono">
                <p>No recent activity events recorded yet.</p>
                <p className="text-[11px] text-muted-foreground/70">
                  Interactions like project clicks, demo launches, and resume downloads appear here live.
                </p>
              </div>
            ) : (
              recentEvents.map((event, idx) => (
                <div
                  key={event.id || idx}
                  className="p-3 rounded-xl bg-surface border border-border space-y-1.5 text-xs font-mono hover:border-border-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    {getEventBadge(event.eventType)}
                    <span className="text-[10px] text-muted-foreground">
                      {event.secondsAgo < 60
                        ? `${event.secondsAgo}s ago`
                        : `${Math.round(event.secondsAgo / 60)}m ago`}
                    </span>
                  </div>

                  <div className="text-foreground truncate font-semibold">
                    {event.projectSlug ? (
                      <span>Project: <strong className="text-primary">{event.projectSlug}</strong></span>
                    ) : (
                      <span>Route: <strong className="text-foreground">{event.path}</strong></span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                    <span>Visitor #{event.visitorIdShort}</span>
                    <span className="capitalize">{event.device} • {event.browser}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
