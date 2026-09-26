'use client';

import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Database,
  Cloud,
  Radio,
  Server,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { projects } from '@/lib/data/portfolio';

const ARCH_PROJECTS: Array<{
  slug: 'zosh-bazaar' | 'classyshop' | 'snapcart';
  label: string;
  badge: string;
  vendorModel: string;
  modelDetails: string;
}> = [
  {
    slug: 'zosh-bazaar',
    label: 'Zosh Bazaar',
    badge: 'Multi-Vendor (5 Portals)',
    vendorModel: 'Multi-Vendor Marketplace (Client + Seller + Admin)',
    modelDetails:
      'True multi-tenant marketplace with 5 decoupled micro-frontends connecting independent merchants (Seller Console) with platform oversight (Super Admin), logistics hub, delivery riders, and shoppers (Storefront).',
  },
  {
    slug: 'classyshop',
    label: 'ClassyShop',
    badge: 'Single-Vendor (3-Tier)',
    vendorModel: 'Single-Vendor Direct Store (D2C)',
    modelDetails:
      'Direct brand-to-consumer store where a single store owner/admin manages inventory, sales analytics, and automated invoicing directly for customers (no 3rd-party sellers).',
  },
  {
    slug: 'snapcart',
    label: 'Snapcart',
    badge: 'Quick-Commerce (Dark Store)',
    vendorModel: 'Quick-Commerce Dark Store Hub',
    modelDetails:
      'Direct warehouse/dark-store rapid fulfillment (10-min delivery) with sub-second Socket.IO live rider GPS tracking and a Python collaborative ML recommendation service.',
  },
];

export function ArchitectureVisualizer() {
  const [selectedProject, setSelectedProject] = useState<'zosh-bazaar' | 'classyshop' | 'snapcart'>('zosh-bazaar');
  const [isPersistenceOpen, setIsPersistenceOpen] = useState(false);
  const [isEventStreamActive, setIsEventStreamActive] = useState(true);
  const project = projects.find((p) => p.slug === selectedProject) || projects[0];
  const [activeNodeId, setActiveNodeId] = useState<string>(
    project.architecture && project.architecture.length > 0 ? project.architecture[0].id : ''
  );

  const currentArch = ARCH_PROJECTS.find((p) => p.slug === selectedProject) || ARCH_PROJECTS[0];

  const activeNode =
    project.architecture?.find((n) => n.id === activeNodeId) || project.architecture?.[0];

  const persistenceNodes =
    project.architecture?.filter((n) => n.type === 'database' || n.type === 'external') || [];

  const handleSwitchProject = (slug: 'zosh-bazaar' | 'classyshop' | 'snapcart') => {
    setSelectedProject(slug);
    const p = projects.find((item) => item.slug === slug);
    if (p && p.architecture && p.architecture.length > 0) {
      setActiveNodeId(p.architecture[0].id);
    }
  };

  const handleCycleNext = () => {
    const idx = ARCH_PROJECTS.findIndex((p) => p.slug === selectedProject);
    const nextIdx = (idx + 1) % ARCH_PROJECTS.length;
    handleSwitchProject(ARCH_PROJECTS[nextIdx].slug);
  };

  const handleCyclePrev = () => {
    const idx = ARCH_PROJECTS.findIndex((p) => p.slug === selectedProject);
    const prevIdx = (idx - 1 + ARCH_PROJECTS.length) % ARCH_PROJECTS.length;
    handleSwitchProject(ARCH_PROJECTS[prevIdx].slug);
  };

  const handleSelectNode = (nodeId: string) => {
    setActiveNodeId(nodeId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const el = document.getElementById('node-inspector-drawer');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'client':
        return Layers;
      case 'server':
        return Server;
      case 'database':
        return Database;
      case 'external':
        return Cloud;
      case 'service':
        return Radio;
      default:
        return Cpu;
    }
  };

  return (
    <section id="architecture" className="pt-4 sm:pt-6 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-5 sm:mb-6 gap-4 sm:gap-6">
        <div className="min-w-0 max-w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-400 text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Interactive Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-extrabold text-foreground tracking-tight sm:whitespace-nowrap">
            System Architecture Blueprint
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-2">
            Interactive blueprint showing how micro-frontends, API gateways, and real-time databases connect.
          </p>
        </div>

        {/* Project Switcher with Carousel Next/Prev Controls & Endless Loop Wrap */}
        <div className="flex items-center gap-1.5 w-full xl:w-auto self-start xl:self-auto max-w-full shrink-0">
          <button
            type="button"
            onClick={handleCyclePrev}
            className="p-2 sm:p-2.5 rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
            title="Previous Architecture (Cycles)"
            aria-label="Previous Architecture"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            className="flex-1 xl:flex-initial flex overflow-x-auto items-center gap-1.5 bg-surface border border-border p-1.5 rounded-xl shadow-xs mobile-scroll-x scroll-smooth overscroll-contain"
          >
            {ARCH_PROJECTS.map((item) => (
              <button
                key={item.slug}
                onClick={() => handleSwitchProject(item.slug)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedProject === item.slug
                    ? 'bg-primary/20 text-primary border border-border-accent font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{item.label}</span>
                <span className="hidden sm:inline text-[10px] ml-1 opacity-70">({item.badge})</span>
              </button>
            ))}
            {/* Wrap back to 1st button for mobile infinite scroll feel */}
            <button
              type="button"
              onClick={() => handleSwitchProject('zosh-bazaar')}
              className="px-2.5 py-2 rounded-lg text-[11px] font-mono text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/30 whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
              title="Wrap back to first architecture"
            >
              <span>↺ 1st</span>
            </button>
            {/* End spacer */}
            <div className="shrink-0 w-6 h-1 pointer-events-none" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={handleCycleNext}
            className="p-2 sm:p-2.5 rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
            title="Next Architecture (Cycles)"
            aria-label="Next Architecture"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Topology Flow */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-4 sm:p-8 space-y-6 sm:space-y-8 relative overflow-hidden shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
                Topology Map: {project.name}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-primary/15 text-primary border border-border-accent">
                {currentArch.badge}
              </span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground shrink-0">Click node to inspect</span>
          </div>

          {/* Architecture & Business Model Explainer Banner */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-surface/80 border border-border/80 text-xs font-mono space-y-1">
            <div className="flex items-center gap-2 text-foreground font-semibold flex-wrap">
              <span className="text-cyan-600 dark:text-cyan-400">⚡ Architecture Topology:</span>
              <span className="text-primary">{currentArch.vendorModel}</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {currentArch.modelDetails}
            </p>
          </div>

          {/* Layer 1: Ingress Clients */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
              1. Client / Micro-Frontend Ingress Layer
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.architecture
                ?.filter((n) => n.type === 'client')
                .map((node) => {
                  const isSelected = activeNode?.id === node.id;
                  const Icon = getNodeIcon(node.type);
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => handleSelectNode(node.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/15 border-border-accent text-foreground shadow-md scale-[1.02]'
                          : 'bg-surface border-border text-muted-foreground hover:border-border-accent hover:text-foreground hover:bg-surface-elevated'
                      }`}
                      data-cursor="INSPECT"
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">{node.label}</div>
                        <div className="text-[10px] font-mono text-muted-foreground truncate">
                          {node.technology}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Interactive Connecting Data Stream Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 px-1 w-full max-w-full overflow-hidden">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent min-w-[16px]" />
            <button
              type="button"
              onClick={() => setIsEventStreamActive((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/90 hover:bg-accent border border-border-accent text-[10px] sm:text-[11px] font-mono text-accent-foreground transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 active:scale-95"
              title="Interactive Live Event Stream Telemetry (Click to ping)"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isEventStreamActive ? 'bg-emerald-400 animate-ping' : 'bg-primary animate-pulse'
                }`}
              />
              <span className="font-semibold">Event Stream / REST</span>
              <span className="text-emerald-400 font-bold">&lt; 35ms</span>
              <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
            </button>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent min-w-[16px]" />
          </div>

          {/* Layer 2: Core Gateway & Services */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
              2. Core Event Hub &amp; Gateway
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.architecture
                ?.filter((n) => n.type === 'server' || n.type === 'service')
                .map((node) => {
                  const isSelected = activeNode?.id === node.id;
                  const Icon = getNodeIcon(node.type);
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => handleSelectNode(node.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/15 border-border-accent text-foreground shadow-md scale-[1.02]'
                          : 'bg-surface border-border text-muted-foreground hover:border-border-accent hover:text-foreground hover:bg-surface-elevated'
                      }`}
                      data-cursor="INSPECT"
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">{node.label}</div>
                        <div className="text-[10px] font-mono text-muted-foreground truncate">
                          {node.technology}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Animated Connecting Data Stream Bar — Collapsible Persistence & External Handshakes Menu */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 px-1 w-full max-w-full">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent min-w-[12px] hidden sm:block" />
            <button
              type="button"
              onClick={() => setIsPersistenceOpen((prev) => !prev)}
              aria-expanded={isPersistenceOpen}
              className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-accent/90 hover:bg-accent border border-border-accent hover:border-primary/50 text-xs font-mono text-accent-foreground transition-all cursor-pointer shadow-xs group"
              title={isPersistenceOpen ? 'Click to collapse Persistence layer' : 'Click to expand Persistence layer'}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                    isPersistenceOpen ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
                  }`}
                />
                <span className="font-semibold sm:hidden truncate">3. Persistence &amp; External</span>
                <span className="font-semibold hidden sm:inline">3. Persistence &amp; External Handshakes</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface text-muted-foreground font-mono font-bold">
                  {persistenceNodes.length} Nodes
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 shrink-0 ${
                    isPersistenceOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </div>
            </button>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent min-w-[12px] hidden sm:block" />
          </div>

          {/* Layer 3: Persistence & External (Collapsible) */}
          {isPersistenceOpen && (
            <div className="space-y-2 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                  3. Data Clusters &amp; External Integrations
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Click node to inspect architecture specs
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {persistenceNodes.map((node) => {
                  const isSelected = activeNode?.id === node.id;
                  const Icon = getNodeIcon(node.type);
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => handleSelectNode(node.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/15 border-border-accent text-foreground shadow-md scale-[1.02]'
                          : 'bg-surface border-border text-muted-foreground hover:border-border-accent hover:text-foreground hover:bg-surface-elevated'
                      }`}
                      data-cursor="INSPECT"
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">{node.label}</div>
                        <div className="text-[10px] font-mono text-muted-foreground truncate">
                          {node.technology}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Architectural Telemetry & Node Inspector Drawer */}
        <div id="node-inspector-drawer" className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg">
          {activeNode ? (
            <>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">
                    Active Inspection
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-0.5">{activeNode.label}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-primary/10 border border-border-accent text-primary text-[11px] font-mono font-bold uppercase">
                  {activeNode.type}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider block mb-1">
                    Technology &amp; Protocol
                  </span>
                  <div className="p-3 rounded-xl bg-surface border border-border font-mono text-xs text-foreground">
                    {activeNode.technology}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider block mb-1">
                    System Responsibility
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-surface/50 p-3.5 rounded-xl border border-border">
                    {activeNode.description}
                  </p>
                </div>

                {activeNode.connections && activeNode.connections.length > 0 && (
                  <div>
                    <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider block mb-2">
                      Downstream Network Connections:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeNode.connections.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-border text-xs font-mono text-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{c}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Architectural Trade-offs & Engineering Decisions */}
              {project.challenges && project.challenges.length > 0 && (
                <div className="pt-4 border-t border-border space-y-3">
                  <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider block">
                    Engineering Challenge Solved:
                  </span>
                  <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
                    <div className="font-bold text-foreground">
                      {project.challenges[0].title}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.challenges[0].solution}
                    </p>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{project.challenges[0].impact}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm font-mono">
              Select a node from the topology diagram to inspect architectural details.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ArchitectureVisualizer;
