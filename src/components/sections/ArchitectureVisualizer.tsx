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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Distributed Systems Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            System Architecture Blueprint
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2">
            Click into each system boundary to inspect responsibilities, data flow, communication protocols, and architectural trade-offs.
          </p>
        </div>

        {/* Project Selector Tab */}
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => handleSwitchProject('zosh-bazaar')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              selectedProject === 'zosh-bazaar'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Zosh Bazaar (Micro-frontends)
          </button>
          <button
            onClick={() => handleSwitchProject('snapcart')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              selectedProject === 'snapcart'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Snapcart (10-Min + ML Engine)
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Architecture Topology Graph (Interactive Node Buttons) */}
        <div className="lg:col-span-7 bg-[#090910] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Topology Map: {project.name}
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">Interactive Click-to-Inspect</span>
          </div>

          {/* Node Category Groups */}
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
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
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 scale-[1.02]'
                            : 'bg-white/[0.02] border-white/[0.08] text-neutral-300 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                        data-cursor="INSPECT"
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-400 text-black' : 'bg-white/5 text-cyan-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{node.label}</div>
                          <div className="text-[10px] font-mono text-neutral-400">{node.technology}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
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
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 scale-[1.02]'
                            : 'bg-white/[0.02] border-white/[0.08] text-neutral-300 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                        data-cursor="INSPECT"
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-400 text-black' : 'bg-white/5 text-cyan-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{node.label}</div>
                          <div className="text-[10px] font-mono text-neutral-400">{node.technology}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
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
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 scale-[1.02]'
                            : 'bg-white/[0.02] border-white/[0.08] text-neutral-300 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                        data-cursor="INSPECT"
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-400 text-black' : 'bg-white/5 text-cyan-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{node.label}</div>
                          <div className="text-[10px] font-mono text-neutral-400">{node.technology}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Node Inspector */}
        <div className="lg:col-span-5 bg-[#0b0b14] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Node Specification
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] uppercase">
              {activeNode?.type}
            </span>
          </div>

          {activeNode ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{activeNode.label}</h3>
                <p className="text-xs font-mono text-cyan-300 mt-1">Tech Stack: {activeNode.technology}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Core Responsibility</span>
                <p className="text-sm text-neutral-300 leading-relaxed bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl">
                  {activeNode.description}
                </p>
              </div>

              {activeNode.connections && activeNode.connections.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Downstream Data Flow</span>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.connections.map((connId) => (
                      <span
                        key={connId}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3 text-cyan-400" />
                        {connId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Architectural Highlights */}
              <div className="border-t border-white/[0.08] pt-5 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">System Integrity Highlights</span>
                <ul className="space-y-2 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Non-blocking async request pipelines with structured error responses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Role-based token validation (RBAC) ensuring zero unauthorized access.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Resilient failover fallback and automatic reconnection handshake.</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Select any node on the left to inspect its system parameters.</p>
          )}
        </div>
      </div>
    </section>
  );
}
export default ArchitectureVisualizer;
