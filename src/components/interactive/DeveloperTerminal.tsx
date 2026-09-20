'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, CornerDownLeft } from 'lucide-react';
import { projects, personalInfo, skills } from '@/lib/data/portfolio';
import { themes, setTheme, ThemeId } from '@/lib/theme';

interface CommandOutput {
  command: string;
  response: React.ReactNode;
}

export function DeveloperTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'init',
      response: (
        <div className="space-y-1">
          <p className="text-primary font-bold">Rahul Raj [Full-Stack + Real-Time + AI Systems v2.5]</p>
          <p className="text-muted-foreground">Type <span className="text-amber-500 font-semibold">help</span> to list available commands. Press ESC or close to exit.</p>
        </div>
      ),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandList, setCommandList] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('toggle-terminal', handleToggle);
    return () => window.removeEventListener('toggle-terminal', handleToggle);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    setCommandList((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    let res: React.ReactNode;

    switch (trimmed) {
      case 'help':
        res = (
          <div className="space-y-1 text-sm">
            <p className="text-foreground font-semibold mb-1">Available commands:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div><span className="text-primary font-mono">about</span> — Engineering bio & philosophy</div>
              <div><span className="text-primary font-mono">projects</span> — Flagship & featured systems</div>
              <div><span className="text-primary font-mono">architecture</span> — High-level distributed blueprint</div>
              <div><span className="text-primary font-mono">skills</span> — Verified tech stack & proficiencies</div>
              <div><span className="text-primary font-mono">system</span> — Architecture telemetry & engine</div>
              <div><span className="text-primary font-mono">whoami</span> — Current session credentials</div>
              <div><span className="text-primary font-mono">date</span> — System ISO timestamp</div>
              <div><span className="text-primary font-mono">contact</span> — Get direct contact links</div>
              <div><span className="text-primary font-mono">github</span> — Open GitHub in browser</div>
              <div><span className="text-primary font-mono">theme</span> — Switch color theme tokens (cyber-cyan, synth-violet, matrix-emerald, solar-amber, crimson-overdrive, studio-light)</div>
              <div><span className="text-primary font-mono">clear</span> — Clear the terminal screen</div>
              <div><span className="text-primary font-mono">exit</span> — Close developer terminal</div>
            </div>
          </div>
        );
        break;

      case 'about':
        res = (
          <div className="space-y-1 text-muted-foreground text-xs leading-relaxed">
            <p className="text-primary font-semibold">Rahul Raj — Full-Stack Engineer</p>
            <p>Passionate about building production-grade digital products where thoughtful interfaces meet robust distributed systems.</p>
            <p>Specializes in Next.js, Node.js, Socket.IO real-time pipelines, MongoDB clustering, and AI provider integrations.</p>
          </div>
        );
        break;

      case 'projects':
        res = (
          <div className="space-y-2 text-xs">
            {projects.slice(0, 4).map((p) => (
              <div key={p.slug} className="border-l-2 border-border-accent pl-2">
                <span className="font-bold text-foreground">{p.name}</span>{' '}
                <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border border-border-accent/40 rounded font-mono">
                  {p.category}
                </span>
                <p className="text-muted-foreground mt-0.5">{p.tagline}</p>
                <p className="text-muted-foreground/70 text-[11px]">{p.technologies.slice(0, 5).join(' • ')}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'architecture':
        res = (
          <div className="font-mono text-xs text-foreground space-y-1 bg-surface p-2.5 rounded border border-border">
            <p className="text-primary font-bold">Multi-Service System Architecture Pattern:</p>
            <p>[Client Storefront / Consoles] ──(HTTP/WS)──&gt; [Gateway API &amp; Socket Hub]</p>
            <p>&nbsp;&nbsp;├── [RBAC &amp; JWT Middleware] ──&gt; [Controller &amp; Services]</p>
            <p>&nbsp;&nbsp;├── [MongoDB Atlas] ── Index-optimized transactions</p>
            <p>&nbsp;&nbsp;├── [Redis Cache &amp; Pub/Sub] ── Real-time state synchronization</p>
            <p>&nbsp;&nbsp;└── [Python ML Engine] ── Recommendation &amp; relevance scoring</p>
          </div>
        );
        break;

      case 'skills':
        res = (
          <div className="space-y-1 text-xs">
            <p className="text-primary font-semibold">Verified Technical Proficiencies:</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {skills.map((s) => (
                <span key={s.name} className="px-2 py-0.5 bg-surface border border-border rounded text-foreground font-mono text-[11px]">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        );
        break;

      case 'contact':
        res = (
          <div className="space-y-1 text-xs text-foreground">
            <p><span className="text-muted-foreground font-mono">Email:</span> <a href={`mailto:${personalInfo.email}`} className="text-primary hover:underline">{personalInfo.email}</a></p>
            <p><span className="text-muted-foreground font-mono">GitHub:</span> <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-primary hover:underline">{personalInfo.github}</a></p>
            <p><span className="text-muted-foreground font-mono">Status:</span> <span className="text-emerald-500 dark:text-emerald-400 font-semibold">Available for Opportunities</span></p>
          </div>
        );
        break;

      case 'whoami':
        res = (
          <p className="text-xs text-muted-foreground">
            guest@rahul-portfolio (visitor session: recruiter/engineer). Full access granted upon hiring.
          </p>
        );
        break;

      case 'date':
        res = <p className="text-xs font-mono text-primary">{new Date().toISOString()}</p>;
        break;

      case 'system':
        res = (
          <div className="space-y-1 text-xs text-muted-foreground font-mono">
            <p className="text-primary font-bold">Telemetry Report:</p>
            <p>• Framework: Next.js 16 (App Router + Turbopack)</p>
            <p>• Engine: React 19 + TypeScript</p>
            <p>• Styling: Tailwind CSS v4 Semantic Tokens</p>
            <p>• Linter: Oxlint (Rust)</p>
            <p>• Prerendered Routes: 23 (SSG)</p>
            <p>• Status: 100% Verified Production Build</p>
          </div>
        );
        break;

      case 'github':
        window.open(personalInfo.github, '_blank', 'noopener,noreferrer');
        res = <p className="text-xs text-primary">Opening {personalInfo.github} in new tab...</p>;
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
        setIsOpen(false);
        setInput('');
        return;

      case 'sudo':
        res = <p className="text-xs text-destructive">Permission denied: You are a guest in Rahul&apos;s workspace. Full access granted upon hiring.</p>;
        break;

      default:
        if (trimmed === 'theme' || trimmed.startsWith('theme ')) {
          const parts = trimmed.split(' ');
          const targetTheme = parts[1];
          if (!targetTheme || targetTheme === 'list') {
            res = (
              <div className="space-y-1 text-xs font-mono">
                <p className="text-primary font-bold">Available Design Token Themes:</p>
                {themes.map((t) => (
                  <div key={t.id}>
                    <span className="text-foreground font-bold">{t.id}</span> — {t.name} ({t.label})
                  </div>
                ))}
                <p className="text-muted-foreground mt-1">Usage: theme &lt;theme-id&gt; (e.g. theme synth-violet)</p>
              </div>
            );
          } else if (themes.some((t) => t.id === targetTheme)) {
            setTheme(targetTheme as ThemeId);
            res = (
              <p className="text-xs font-mono text-emerald-500 dark:text-emerald-400">
                Switched color design tokens to: <span className="font-bold">{targetTheme}</span>
              </p>
            );
          } else {
            res = (
              <p className="text-xs text-destructive">
                Unknown theme &apos;{targetTheme}&apos;. Type <span className="text-primary font-bold">theme list</span> to view valid themes.
              </p>
            );
          }
          break;
        }
        res = (
          <p className="text-xs text-destructive">
            Command not recognized: &apos;{trimmed}&apos;. Type <span className="text-primary font-bold">help</span> for available commands.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: trimmed, response: res }]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      if (commandList.length > 0) {
        const nextIndex = historyIndex === -1 ? commandList.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(commandList[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandList.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIndex);
          setInput(commandList[nextIndex]);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9990] w-full max-w-xl max-h-[85vh] flex flex-col bg-card/95 backdrop-blur-xl border border-border-accent rounded-2xl shadow-2xl overflow-hidden font-mono text-foreground animate-in slide-in-from-bottom-5 duration-200">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-border select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">rahul@workspace: ~</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[380px] text-xs">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold">
              <span>❯</span>
              <span>{item.command}</span>
            </div>
            <div className="pl-4">{item.response}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border-t border-border">
        <span className="text-primary font-bold text-sm">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-xs font-mono"
        />
        <button
          onClick={() => handleCommand(input)}
          className="text-muted-foreground hover:text-primary p-1 transition-colors"
          title="Execute"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
export default DeveloperTerminal;
