'use client';

import React, { useState } from 'react';
import { Layers, Cpu, Database, Cloud, Radio, Sparkles, ChevronRight, Server, CheckCircle2 } from 'lucide-react';
import { projects } from '@/lib/data/portfolio';

export function ArchitectureVisualizer() {
  const [selectedProject, setSelectedProject] = useState<'zosh-bazaar' | 'snapcart'>('zosh-bazaar');
  const project = projects.find((p) => p.slug === selectedProject) || projects[0];
  const [activeNodeId, setActiveNodeId] = useState<string>(
    project.architecture && project.architecture.length > 0 ? project.architecture[0].id : ''
  );

  const activeNode = project.architecture?.find((n) => n.id === activeNodeId) || project.architecture?.[0];

  const handleSwitchProject = (slug: 'zosh-bazaar' | 'snapcart') => {
    setSelectedProject(slug);
    const p = projects.find((item) => item.slug === slug);
    if (p && p.architecture && p.architecture.length > 0) {
      setActiveNodeId(p.architecture[0].id);
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
    <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>Interactive Distributed Systems Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            System Architecture Blueprint
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-2">
            Click into each system boundary to inspect responsibilities, data flow, communication protocols, and architectural trade-offs.
          </p>
        </div>

        {/* Project Selector Tab */}
        <div className="flex items-center gap-2 bg-surface border border-border p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => handleSwitchProject('zosh-bazaar')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              selectedProject === 'zosh-bazaar'
                ? 'bg-primary/20 text-primary border border-border-accent font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Zosh Bazaar (Micro-frontends)
          </button>
          <button
            onClick={() => handleSwitchProject('snapcart')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              selectedProject === 'snapcart'
                ? 'bg-primary/20 text-primary border border-border-accent font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Snapcart (10-Min + ML Engine)
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Architecture Topology Graph (Interactive Node Buttons) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                Topology Map: {project.name}
              </span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">Interactive Click-to-Inspect</span>
          </div>

          {/* Node Category Groups */}
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">
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
                        onClick={() => setActiveNodeId(node.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-primary/15 border-border-accent text-foreground shadow-lg shadow-primary/10 scale-[1.02]'
                            : 'bg-surface border-border text-muted-foreground hover:border-border-accent hover:text-foreground hover:bg-surface-elevated'
                        }`}
                        data-cursor="INSPECT"
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">{node.label}</div>
                          <div className="text-[10px] font-mono text-muted-foreground">{node.technology}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                2. API Gateway, WebSocket Hub &amp; Business Services
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
                        onClick={() => setActiveNodeId(node.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-primary/15 border-border-accent text-foreground shadow-lg shadow-primary/10 scale-[1.02]'
                            : 'bg-surface border-border text-muted-foreground hover:border-border-accent hover:text-foreground hover:bg-surface-elevated'
                        }`}
                        data-cursor="INSPECT"
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">{node.label}</div>
                          <div className="text-[10px] font-mono text-muted-foreground">{node.technology}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                3. Persistence, Caching &amp; External Integrations
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.architecture
                  ?.filter((n) => n.type === 'database' || n.type === 'external')
                  .map((node) => {
                    const isSelected = activeNode?.id === node.id;
                    const Icon = getNodeIcon(node.type);
                    return (
                      <button
                        key={node.id}
                        onClick={() => setActiveNodeId(node.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-primary/15 border-border-accent text-foreground shadow-lg shadow-primary/10 scale-[1.02]'
                            : 'bg-surface border-border text-muted-foreground hover:border-border-accent hover:text-foreground hover:bg-surface-elevated'
                        }`}
                        data-cursor="INSPECT"
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">{node.label}</div>
                          <div className="text-[10px] font-mono text-muted-foreground">{node.technology}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Node Inspector */}
        <div className="lg:col-span-5 bg-surface-elevated border border-border-accent rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-primary flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Node Specification
            </span>
            <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground font-mono text-[10px] uppercase border border-border-accent">
              {activeNode?.type}
            </span>
          </div>

          {activeNode ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{activeNode.label}</h3>
                <p className="text-xs font-mono text-primary mt-1">Tech Stack: {activeNode.technology}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Core Responsibility</span>
                <p className="text-sm text-foreground leading-relaxed bg-surface border border-border p-3.5 rounded-xl">
                  {activeNode.description}
                </p>
              </div>

              {activeNode.connections && activeNode.connections.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Downstream Data Flow</span>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.connections.map((connId) => (
                      <span
                        key={connId}
                        className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-mono text-foreground flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3 text-primary" />
                        {connId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Architectural Highlights */}
              <div className="border-t border-border pt-5 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">System Integrity Highlights</span>
                <ul className="space-y-2 text-xs text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Non-blocking async request pipelines with structured error responses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Role-based token validation (RBAC) ensuring zero unauthorized access.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Resilient failover fallback and automatic reconnection handshake.</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select any node on the left to inspect its system parameters.</p>
          )}
        </div>
      </div>
    </section>
  );
}
export default ArchitectureVisualizer;
