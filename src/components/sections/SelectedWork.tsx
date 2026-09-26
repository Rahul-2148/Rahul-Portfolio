'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  Sparkles,
  Globe,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Search,
  X,
  LayoutGrid,
  List,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { projects as defaultProjects } from '@/lib/data/portfolio';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { TechIcon } from '@/components/ui/TechIcons';
import { Project } from '@/types';
import { trackEvent } from '@/lib/analytics/tracker';

/* ─── Interactive Card Image Slider Component ─── */
function ProjectCardMedia({
  images,
  projectName,
  accentColor,
}: {
  images: string[];
  projectName: string;
  accentColor: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback when no screenshots/media available
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-44 sm:h-48 bg-surface-elevated/40 border-b border-border/80 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <ImageIcon className="w-6 h-6 opacity-40 text-muted-foreground" />
          <span className="text-[11px] font-mono text-muted-foreground">{projectName} Preview</span>
        </div>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  return (
    <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-black/40 border-b border-border/80 group/slider select-none">
      {/* Current Slide Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[currentIndex]}
        alt={`${projectName} screenshot ${currentIndex + 1}`}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/slider:scale-105"
        loading="lazy"
      />

      {/* Vignette bottom gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Multiple images controls (interactive slider) */}
      {images.length > 1 && (
        <>
          {/* Slide counter pill */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-mono font-medium text-white/90 shadow-md z-10">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            type="button"
            aria-label="Previous screenshot"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/65 hover:bg-black/85 text-white/90 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg z-10 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleNext}
            type="button"
            aria-label="Next screenshot"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/65 hover:bg-black/85 text-white/90 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg z-10 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 z-10">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleDotClick(e, idx)}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-4 bg-white shadow-xs'
                      : 'w-1.5 bg-white/40 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface SelectedWorkProps {
  isHomePage?: boolean;
}

export function SelectedWork({ isHomePage }: SelectedWorkProps) {
  const pathname = usePathname();
  const isHome = isHomePage ?? (pathname === '/');

  const [projectList, setProjectList] = useState<Project[]>(defaultProjects);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'impact' | 'recent' | 'alpha'>('impact');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(isHome ? 6 : 9);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.projects && Array.isArray(data.data.projects) && data.data.projects.length > 0) {
          const published = data.data.projects.filter(
            (p: Project) => !p.status || p.status === 'published'
          );
          published.sort((a: Project, b: Project) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          setProjectList(published);
        }
      })
      .catch(() => {
        // Fallback to static data
      });
  }, []);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'flagship', label: '⚡ Flagships' },
    { id: 'E-commerce', label: 'E-Commerce' },
    { id: 'multi-vendor', label: '🏪 Multi-Vendor' },
    { id: 'single-vendor', label: '🛍️ Single-Vendor D2C' },
    { id: 'Realtime', label: 'Real-Time' },
    { id: 'Social', label: 'Social & Collab' },
    { id: 'Full Stack', label: 'Full Stack' },
  ];

  // Common popular tech tags for quick filtering
  const popularTechTags = [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'Docker',
    'Socket.IO',
    'Python',
    'Redis',
    'Stripe',
    'Razorpay',
  ];

  // Multi-dimensional filter & sort engine
  const filteredProjects = useMemo(() => {
    let list = [...projectList];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const matchName = p.name?.toLowerCase().includes(q);
        const matchTagline = p.tagline?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchTech = p.technologies?.some((t) => t.toLowerCase().includes(q));
        const matchCategory = p.category?.toLowerCase().includes(q);
        const matchVendor = p.vendorModel?.toLowerCase().includes(q);
        const matchPortals = p.portalsList?.some((portal) => portal.toLowerCase().includes(q));
        return (
          matchName ||
          matchTagline ||
          matchDesc ||
          matchTech ||
          matchCategory ||
          matchVendor ||
          matchPortals
        );
      });
    }

    // 2. Category / Tier / Architecture filter
    if (filter !== 'all') {
      if (filter === 'flagship') {
        list = list.filter((p) => p.tier === 'S');
      } else if (filter === 'multi-vendor') {
        list = list.filter(
          (p) => p.vendorModel?.toLowerCase().includes('multi-vendor') || p.slug === 'zosh-bazaar'
        );
      } else if (filter === 'single-vendor') {
        list = list.filter(
          (p) => p.vendorModel?.toLowerCase().includes('single-vendor') || p.slug === 'classyshop'
        );
      } else {
        list = list.filter((p) => p.category === filter);
      }
    }

    // 3. Tech Stack Tag filter
    if (selectedTech) {
      list = list.filter((p) => p.technologies?.includes(selectedTech));
    }

    // 4. Sorting
    if (sortBy === 'recent') {
      list.sort((a, b) => (b.year || '').localeCompare(a.year || ''));
    } else if (sortBy === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: Impact Tier (S -> A -> B -> C), then sortOrder
      const tierOrder: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 };
      list.sort((a, b) => {
        const tierA = tierOrder[a.tier] ?? 99;
        const tierB = tierOrder[b.tier] ?? 99;
        if (tierA !== tierB) return tierA - tierB;
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      });
    }

    return list;
  }, [projectList, searchQuery, filter, selectedTech, sortBy]);

  // Display subset based on home or visibleCount
  const displayedProjects = useMemo(() => {
    if (isHome) {
      return filteredProjects.slice(0, 6);
    }
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, isHome, visibleCount]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilter('all');
    setSelectedTech(null);
    setVisibleCount(isHome ? 6 : 9);
  };

  return (
    <section
      id="work"
      className="pt-2 sm:pt-4 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8"
    >
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-border/80 pb-5 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-400 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{isHome ? 'Featured Portfolio Work' : 'Full Engineering Directory'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            {isHome ? (
              <>
                Selected <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">Projects</span>
              </>
            ) : (
              <>
                Engineering <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">Directory</span>
              </>
            )}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-2">
            {isHome
              ? 'Hand-picked flagship distributed platforms and full-stack systems engineered for scale.'
              : `Explore all ${projectList.length} production applications, real-time microservices, and client architectures.`}
          </p>
        </div>

        {/* Home mode quick category pills */}
        {isHome && (
          <div className="flex overflow-x-auto items-center gap-1.5 bg-surface/90 border border-border p-1.5 rounded-2xl backdrop-blur-md self-start md:self-auto shadow-xs mobile-scroll-x">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  filter === cat.id
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Advanced Controls Bar for 50+ Projects (Search, Tags, Sort, Grid/Table Switcher) ─── */}
      {!isHome && (
        <div className="space-y-4 bg-surface/50 border border-border/80 p-4 sm:p-5 rounded-2xl backdrop-blur-md shadow-sm">
          {/* Top Row: Search Input + Sort + View Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Instant Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(9);
                }}
                placeholder="Search projects by name, tech, or feature..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-purple-500 placeholder:text-muted-foreground/60 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Tools: Sort Dropdown + View Mode Switcher */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-border text-xs font-mono">
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'impact' | 'recent' | 'alpha')}
                  aria-label="Sort projects"
                  className="bg-transparent text-foreground text-xs font-mono focus:outline-none cursor-pointer"
                >
                  <option value="impact" className="bg-surface text-foreground">Sort: Impact (S→C)</option>
                  <option value="recent" className="bg-surface text-foreground">Sort: Year (Recent)</option>
                  <option value="alpha" className="bg-surface text-foreground">Sort: Name (A-Z)</option>
                </select>
              </div>

              {/* Grid / Table View Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Grid Cards with Sliders"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Compact Table / List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Middle Row: Category Filter Tabs */}
          <div className="flex overflow-x-auto items-center gap-1.5 pt-1 border-t border-border/50 mobile-scroll-x scroll-smooth overscroll-contain">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilter(cat.id);
                  setVisibleCount(9);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  filter === cat.id
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-surface hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {cat.label}
              </button>
            ))}
            {/* End spacer so last item never clips or sticks to edge */}
            <div className="shrink-0 w-8 h-1 pointer-events-none" aria-hidden="true" />
          </div>

          {/* Bottom Row: Popular Tech Stack Filter Chips */}
          <div className="flex overflow-x-auto items-center gap-1.5 pt-1 text-[11px] font-mono mobile-scroll-x scroll-smooth overscroll-contain">
            <span className="text-muted-foreground text-[10px] uppercase font-bold mr-1 whitespace-nowrap shrink-0">
              Tech Tag:
            </span>
            {popularTechTags.map((tech) => {
              const active = selectedTech === tech;
              return (
                <button
                  key={tech}
                  onClick={() => {
                    setSelectedTech(active ? null : tech);
                    setVisibleCount(9);
                  }}
                  className={`inline-flex flex-row items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 font-bold'
                      : 'bg-surface hover:bg-muted border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TechIcon name={tech} className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{tech}</span>
                </button>
              );
            })}
            {(searchQuery || filter !== 'all' || selectedTech) && (
              <button
                onClick={handleClearFilters}
                className="ml-auto text-[10px] text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 font-bold underline font-mono cursor-pointer whitespace-nowrap shrink-0 pl-2"
              >
                Reset All Filters
              </button>
            )}
            {/* End spacer so last item never clips or sticks to edge */}
            <div className="shrink-0 w-8 h-1 pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* ─── Zero Search Results Empty State ─── */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 px-4 border border-dashed border-border rounded-2xl bg-surface/30 space-y-3">
          <Search className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
          <h4 className="text-base font-bold text-foreground">No projects matching your search criteria</h4>
          <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto">
            Try adjusting keywords, selecting another technology filter, or clearing the search.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* ─── View 1: Compact Grid View (Cards with Image Sliders) ─── */}
      {viewMode === 'grid' && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {displayedProjects.map((project, idx) => {
            const accentColor = project.color || (idx % 2 === 0 ? '#00d4ff' : '#a855f7');
            const projectImages =
              project.gallery && project.gallery.length > 0
                ? project.gallery
                : project.image
                  ? [project.image]
                  : [];

            return (
              <SpotlightCard
                key={project.slug}
                spotlightColor={`${accentColor}20`}
                className="flex flex-col justify-between border-border hover:border-purple-500/50 bg-card/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group"
                data-cursor="PROJECT"
              >
                {/* Browser / Terminal Visual Mockup Header */}
                <div className="bg-surface/95 border-b border-border px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-green-500/80 inline-block" />
                    <span className="text-[10px] font-mono text-muted-foreground ml-2 truncate max-w-[120px] sm:max-w-[150px]">
                      {project.slug}.app
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${accentColor}18`,
                        color: accentColor,
                        border: `1px solid ${accentColor}35`,
                      }}
                    >
                      {project.tier === 'S' ? '⭐ Featured' : 'Production'}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{project.year}</span>
                  </div>
                </div>

                {/* Real Project Media Showcase with Interactive Gallery Slider */}
                <ProjectCardMedia
                  images={projectImages}
                  projectName={project.name}
                  accentColor={accentColor}
                />

                {/* Card Body (Compact & Balanced) */}
                <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Category & Architecture / Vendor Model Badge */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-foreground font-medium whitespace-nowrap shrink-0">
                        {project.category}
                      </span>
                      {project.vendorModel ? (
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-[10px] whitespace-nowrap shrink-0 border ${
                            project.vendorModel.includes('Multi-Vendor')
                              ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                              : project.vendorModel.includes('Single-Vendor')
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                              : project.vendorModel.includes('Quick-Commerce')
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
                          }`}
                        >
                          {project.vendorModel}
                        </span>
                      ) : (
                        <>
                          <span className="text-muted-foreground shrink-0">•</span>
                          <span className="text-cyan-600 dark:text-cyan-400 font-medium truncate whitespace-nowrap">
                            {project.type || 'Full-Stack'}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Project Title */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 font-mono mt-0.5 truncate">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Description (Cleanly clamped) */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Key Capabilities / Features Pills */}
                    {project.features && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.features.slice(0, 2).map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="inline-flex flex-row items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface border border-border text-foreground/90 text-[10px] font-mono whitespace-nowrap shrink-0 max-w-full"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: accentColor }}
                            />
                            <span className="truncate max-w-[200px] whitespace-nowrap">{feat}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex flex-row items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-[10px] font-mono text-foreground font-medium whitespace-nowrap shrink-0"
                      >
                        <TechIcon name={tech} className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">{tech}</span>
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-muted border border-border text-[10px] font-mono text-muted-foreground whitespace-nowrap shrink-0">
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions with Vibrant Interactive Buttons */}
                <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-surface/90 border-t border-border flex items-center justify-between gap-2">
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex flex-row items-center gap-1 text-xs font-bold text-foreground hover:text-purple-400 transition-colors group/link whitespace-nowrap shrink-0 py-1"
                  >
                    <span className="whitespace-nowrap">Specs</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>

                  <div className="flex items-center gap-2 shrink-0">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackEvent('github_click', { projectSlug: project.slug })}
                        className="inline-flex flex-row items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-muted border border-border text-xs font-mono text-foreground transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 shadow-xs"
                        title="GitHub Repository"
                        data-cursor="CODE"
                      >
                        <GithubIcon className="w-4 h-4 shrink-0 text-foreground" />
                        <span className="text-[11px] font-medium whitespace-nowrap">Code</span>
                      </a>
                    )}

                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackEvent('live_demo_click', { projectSlug: project.slug })}
                        className="inline-flex flex-row items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold shadow-md shadow-purple-600/25 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
                        title="Try Now"
                        data-cursor="LIVE"
                      >
                        <Globe className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">Try Now</span>
                      </a>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}

      {/* ─── View 2: Compact Table / Directory List View (GitHub & Linear Style) ─── */}
      {viewMode === 'table' && filteredProjects.length > 0 && (
        <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card/90 backdrop-blur-md shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/80 text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                <th className="py-3 px-4 hidden md:table-cell">Tech Stack</th>
                <th className="py-3 px-4 hidden lg:table-cell">Year</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs font-mono">
              {displayedProjects.map((project) => {
                const accentColor = project.color || '#a855f7';
                return (
                  <tr key={project.slug} className="hover:bg-muted/40 transition-colors group">
                    {/* Project Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: accentColor }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/work/${project.slug}`}
                              className="font-bold text-foreground hover:text-purple-400 transition-colors text-sm font-sans"
                            >
                              {project.name}
                            </Link>
                            {project.tier === 'S' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                                ⭐ S-Tier
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs font-sans">
                            {project.tagline}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-[11px] text-muted-foreground">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-foreground">
                          {project.category}
                        </span>
                        {project.vendorModel && (
                          <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-medium">
                            {project.vendorModel}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Technologies Column */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] text-muted-foreground"
                          >
                            <TechIcon name={tech} className="w-2.5 h-2.5" />
                            <span>{tech}</span>
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-[10px] text-muted-foreground self-center">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Year Column */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-[11px] text-muted-foreground">
                      {project.year}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/work/${project.slug}`}
                          className="px-2.5 py-1 rounded-md bg-surface hover:bg-muted border border-border text-[11px] text-muted-foreground hover:text-foreground transition-all"
                          title="Architecture Specs"
                        >
                          Specs
                        </Link>
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded-md bg-surface hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all"
                            title="Code"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.links.live && (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow-sm shadow-purple-600/25 transition-all"
                          >
                            Try Now
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Bottom Action: On Homepage -> Link to Full Directory ─── */}
      {isHome && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-surface to-cyan-500/10 border border-purple-500/25 backdrop-blur-md">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-mono font-bold text-foreground">
                Engineering Archives &amp; Full Directory
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 hover:bg-purple-200/90 text-purple-950 dark:bg-purple-950/80 dark:text-purple-200 border border-purple-300/90 dark:border-purple-500/50 text-[11px] font-mono font-bold shadow-xs transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                {projectList.length} Total Systems
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Browse all microservices, real-time architectures, client work, and open-source packages with instant search and filters.
            </p>
          </div>

          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-105 shrink-0"
          >
            <span>Explore Full Directory ({projectList.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ─── Bottom Action: On /work Directory -> Progressive "Load More" Pagination ─── */}
      {!isHome && filteredProjects.length > visibleCount && (
        <div className="flex flex-col items-center justify-center pt-8 pb-4 space-y-3">
          <div className="text-xs font-mono text-muted-foreground">
            Showing <span className="text-foreground font-bold">{Math.min(visibleCount, filteredProjects.length)}</span> of{' '}
            <span className="text-foreground font-bold">{filteredProjects.length}</span> projects
          </div>

          {/* Sleek Progress Bar */}
          <div className="w-48 h-1.5 rounded-full bg-surface-elevated overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{
                width: `${(Math.min(visibleCount, filteredProjects.length) / filteredProjects.length) * 100}%`,
              }}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold shadow-lg shadow-purple-600/25 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
              <span>Load More Projects</span>
            </button>

            <button
              onClick={() => setVisibleCount(filteredProjects.length)}
              className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-muted border border-border text-foreground text-xs font-mono transition-all cursor-pointer"
            >
              Show All ({filteredProjects.length})
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default SelectedWork;
