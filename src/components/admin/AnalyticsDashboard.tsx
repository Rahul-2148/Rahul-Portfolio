'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Eye,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Project } from '@/types';

interface AnalyticsPayload {
  isConnected: boolean;
  period: string;
  overview: {
    totalViews: number;
    periodEventsCount: number;
    periodPageViews: number;
    periodUniqueVisitors: number;
    totalRecruiters: number;
    uniqueGuests: number;
    todayViews: number;
    todayGuests: number;
    todayRecruiters: number;
    projectViews: number;
    liveClicks: number;
    githubClicks: number;
    resumeDownloads: number;
    contactSubmits: number;
  };
  devices: { desktop: number; mobile: number; tablet: number };
  browsers: Record<string, number>;
  referrers: Record<string, number>;
  chartData: Array<{
    date: string;
    views: number;
    uniqueVisitors: number;
    events: number;
  }>;
  projectStats: Project[];
  recruiters: Array<{
    _id: string;
    name: string;
    email: string;
    company: string;
    role: string;
    purpose: string;
    loginCount: number;
    lastLoginAt: string;
  }>;
}

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<'today' | 'yesterday' | '7d' | '30d' | '90d' | 'this_year' | 'all' | 'custom'>('30d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [projectSearch, setProjectSearch] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      let url = `/api/admin/analytics?period=${period}`;
      if (period === 'custom') {
        if (customFrom) url += `&from=${encodeURIComponent(customFrom)}`;
        if (customTo) url += `&to=${encodeURIComponent(customTo)}`;
      }

      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const handleApplyCustomDate = () => {
    if (customFrom) {
      setPeriod('custom');
      fetchAnalytics();
    }
  };

  const overview = data?.overview || {
    totalViews: 0,
    periodEventsCount: 0,
    periodPageViews: 0,
    periodUniqueVisitors: 0,
    totalRecruiters: 0,
    uniqueGuests: 0,
    todayViews: 0,
    todayGuests: 0,
    todayRecruiters: 0,
    projectViews: 0,
    liveClicks: 0,
    githubClicks: 0,
    resumeDownloads: 0,
    contactSubmits: 0,
  };

  const devices = data?.devices || { desktop: 0, mobile: 0, tablet: 0 };
  const totalDeviceCount = (devices.desktop + devices.mobile + devices.tablet) || 1;
  const desktopPct = Math.round((devices.desktop / totalDeviceCount) * 100);
  const mobilePct = Math.round((devices.mobile / totalDeviceCount) * 100);
  const tabletPct = Math.round((devices.tablet / totalDeviceCount) * 100);

  const chartData = data?.chartData || [];
  const maxChartVal = Math.max(...chartData.map((d) => Math.max(d.views, d.uniqueVisitors, d.events, 1)), 5);

  const filteredProjects = (data?.projectStats || []).filter((p) => {
    if (!projectSearch.trim()) return true;
    const term = projectSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      {/* Date Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
            { id: 'this_year', label: 'This Year' },
            { id: 'all', label: 'All Time' },
            { id: 'custom', label: 'Custom Range' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id as typeof period)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === item.id
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'bg-surface-elevated text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground"
            />
            <button
              onClick={handleApplyCustomDate}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold"
            >
              Apply
            </button>
          </div>
        )}

        <button
          onClick={fetchAnalytics}
          className="self-end md:self-auto p-2 rounded-lg bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border"
          title="Refresh metrics"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Period Page Views</span>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
            {overview.periodPageViews.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">
            All-time: <strong className="text-foreground">{overview.totalViews.toLocaleString()}</strong>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Unique Visitors</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            {overview.periodUniqueVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">
            Verified unique visitor IDs
          </div>
        </div>

        {/* Project Views */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Project Deep-Dives</span>
            <BarChart3 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
            {overview.projectViews.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">
            Detailed case study visits
          </div>
        </div>

        {/* Clicks & Downloads */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>External Conversions</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
            {(overview.liveClicks + overview.githubClicks + overview.resumeDownloads).toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">
            {overview.liveClicks} live • {overview.githubClicks} git • {overview.resumeDownloads} cv
          </div>
        </div>
      </div>

      {/* SVG Time Series Trend Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span>Traffic &amp; Engagement Dynamics</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily verified page views vs unique visitors over selected period
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary" />
              <span className="text-muted-foreground">Page Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-400" />
              <span className="text-muted-foreground">Unique Visitors</span>
            </div>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-muted-foreground">
            Not enough data in this date range yet. Interactions will plot dynamically.
          </div>
        ) : (
          <div className="h-64 w-full flex items-end gap-2 pt-4 border-b border-border relative">
            {chartData.map((item, idx) => {
              const viewHeight = Math.max(8, Math.round((item.views / maxChartVal) * 200));
              const visitorHeight = Math.max(4, Math.round((item.uniqueVisitors / maxChartVal) * 200));

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 bg-black/90 text-white text-[10px] font-mono px-2 py-1 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    <div>{item.date}</div>
                    <div className="text-primary font-bold">Views: {item.views}</div>
                    <div className="text-emerald-400">Uniques: {item.uniqueVisitors}</div>
                  </div>

                  <div className="w-full flex items-end justify-center gap-1">
                    <div
                      style={{ height: `${viewHeight}px` }}
                      className="w-1/2 max-w-[16px] bg-primary/80 group-hover:bg-primary rounded-t-sm transition-all"
                    />
                    <div
                      style={{ height: `${visitorHeight}px` }}
                      className="w-1/2 max-w-[16px] bg-emerald-400/80 group-hover:bg-emerald-400 rounded-t-sm transition-all"
                    />
                  </div>

                  <span className="text-[9px] font-mono text-muted-foreground truncate w-full text-center mt-2">
                    {item.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Breakdowns Grid: Devices, Browsers, Referrers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Distribution */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <h4 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2">
            <Laptop className="w-4 h-4 text-primary" />
            <span>Device Types</span>
          </h4>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex items-center justify-between pb-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Laptop className="w-3.5 h-3.5" /> Desktop
                </span>
                <span className="text-foreground font-bold">{desktopPct}% ({devices.desktop})</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-elevated overflow-hidden">
                <div style={{ width: `${desktopPct}%` }} className="h-full bg-primary rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between pb-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </span>
                <span className="text-foreground font-bold">{mobilePct}% ({devices.mobile})</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-elevated overflow-hidden">
                <div style={{ width: `${mobilePct}%` }} className="h-full bg-emerald-400 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between pb-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Tablet className="w-3.5 h-3.5" /> Tablet
                </span>
                <span className="text-foreground font-bold">{tabletPct}% ({devices.tablet})</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-elevated overflow-hidden">
                <div style={{ width: `${tabletPct}%` }} className="h-full bg-amber-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Browsers */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <h4 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>Browsers</span>
          </h4>

          <div className="space-y-2 text-xs font-mono">
            {Object.keys(data?.browsers || {}).length === 0 ? (
              <div className="text-xs text-muted-foreground py-4">No browser records yet.</div>
            ) : (
              Object.entries(data?.browsers || {}).map(([bName, bCount]) => (
                <div key={bName} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border">
                  <span className="text-muted-foreground">{bName}</span>
                  <span className="text-foreground font-bold">{bCount}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <h4 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-primary" />
            <span>Traffic Referrers</span>
          </h4>

          <div className="space-y-2 text-xs font-mono">
            {Object.keys(data?.referrers || {}).length === 0 ? (
              <div className="text-xs text-muted-foreground py-4">Direct traffic / no referrers.</div>
            ) : (
              Object.entries(data?.referrers || {}).map(([rName, rCount]) => (
                <div key={rName} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border">
                  <span className="text-muted-foreground">{rName}</span>
                  <span className="text-foreground font-bold">{rCount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Projects Performance Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold">
            Project Engagement &amp; Conversion Analytics ({filteredProjects.length})
          </h3>

          <div className="relative max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface border-b border-border text-muted-foreground uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Tier / Status</th>
                  <th className="py-3 px-4 text-right">Views</th>
                  <th className="py-3 px-4 text-right">Demo Clicks</th>
                  <th className="py-3 px-4 text-right">GitHub Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.map((p) => (
                  <tr key={p.slug} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">/work/{p.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{p.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px]">
                        Tier {p.tier} • {p.status || 'published'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-primary">
                      {p.stats?.views || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      {p.stats?.liveClicks || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-muted-foreground">
                      {p.stats?.githubClicks || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
