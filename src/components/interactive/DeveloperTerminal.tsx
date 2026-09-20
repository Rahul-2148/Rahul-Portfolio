'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, CornerDownLeft } from 'lucide-react';
import { projects, personalInfo, skills } from '@/lib/data/portfolio';

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
          <p className="text-cyan-400 font-bold">Rahul Raj [Full-Stack + Real-Time + AI Systems v2.5]</p>
          <p className="text-neutral-400">Type <span className="text-amber-400">help</span> to list available commands. Press ESC or close to exit.</p>
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
            <p className="text-neutral-300 font-semibold mb-1">Available commands:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div><span className="text-cyan-400 font-mono">about</span> — Engineering bio & philosophy</div>
              <div><span className="text-cyan-400 font-mono">projects</span> — Flagship & featured systems</div>
              <div><span className="text-cyan-400 font-mono">architecture</span> — High-level distributed blueprint</div>
              <div><span className="text-cyan-400 font-mono">skills</span> — Verified tech stack & proficiencies</div>
              <div><span className="text-cyan-400 font-mono">system</span> — Architecture telemetry & engine</div>
              <div><span className="text-cyan-400 font-mono">whoami</span> — Current session credentials</div>
              <div><span className="text-cyan-400 font-mono">date</span> — System ISO timestamp</div>
              <div><span className="text-cyan-400 font-mono">contact</span> — Get direct contact links</div>
              <div><span className="text-cyan-400 font-mono">github</span> — Open GitHub in browser</div>
              <div><span className="text-cyan-400 font-mono">clear</span> — Clear the terminal screen</div>
              <div><span className="text-cyan-400 font-mono">exit</span> — Close developer terminal</div>
            </div>
          </div>
        );
        break;

      case 'about':
        res = (
          <div className="space-y-1 text-neutral-300 text-xs leading-relaxed">
            <p className="text-cyan-300 font-semibold">Rahul Raj — Full-Stack Engineer</p>
            <p>Passionate about building production-grade digital products where thoughtful interfaces meet robust distributed systems.</p>
            <p>Specializes in Next.js, Node.js, Socket.IO real-time pipelines, MongoDB clustering, and AI provider integrations.</p>
          </div>
        );
        break;

      case 'projects':
        res = (
          <div className="space-y-2 text-xs">
            {projects.slice(0, 4).map((p) => (
              <div key={p.slug} className="border-l-2 border-cyan-500/50 pl-2">
                <span className="font-bold text-white">{p.name}</span>{' '}
                <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-mono">
                  {p.category}
                </span>
                <p className="text-neutral-400 mt-0.5">{p.tagline}</p>
                <p className="text-neutral-500 text-[11px]">{p.technologies.slice(0, 5).join(' • ')}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'architecture':
        res = (
          <div className="font-mono text-xs text-neutral-300 space-y-1 bg-black/40 p-2 rounded border border-white/5">
            <p className="text-amber-400 font-bold">Multi-Service System Architecture Pattern:</p>
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
            <p className="text-cyan-400 font-semibold">Verified Technical Proficiencies:</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {skills.map((s) => (
                <span key={s.name} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-neutral-300 font-mono text-[11px]">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        );
        break;

      case 'contact':
        res = (
          <div className="space-y-1 text-xs text-neutral-300">
            <p><span className="text-neutral-500 font-mono">Email:</span> <a href={`mailto:${personalInfo.email}`} className="text-cyan-400 hover:underline">{personalInfo.email}</a></p>
            <p><span className="text-neutral-500 font-mono">GitHub:</span> <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{personalInfo.github}</a></p>
            <p><span className="text-neutral-500 font-mono">Status:</span> <span className="text-emerald-400">Available for Opportunities</span></p>
          </div>
        );
        break;

      case 'whoami':
        res = (
          <p className="text-xs text-neutral-300">
            guest@rahul-portfolio (visitor session: recruiter/engineer). Full access granted upon hiring.
          </p>
        );
        break;

      case 'date':
        res = <p className="text-xs font-mono text-cyan-300">{new Date().toISOString()}</p>;
        break;

      case 'system':
        res = (
          <div className="space-y-1 text-xs text-neutral-300 font-mono">
            <p className="text-cyan-400 font-bold">Telemetry Report:</p>
            <p>• Framework: Next.js 16 (App Router + Turbopack)</p>
            <p>• Engine: React 19 + TypeScript</p>
            <p>• Styling: Tailwind CSS v4</p>
            <p>• Linter: Oxlint (Rust)</p>
            <p>• Prerendered Routes: 21 (SSG)</p>
            <p>• Status: 100% Verified Production Build</p>
          </div>
        );
        break;

      case 'github':
        window.open(personalInfo.github, '_blank', 'noopener,noreferrer');
        res = <p className="text-xs text-cyan-400">Opening {personalInfo.github} in new tab...</p>;
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
        res = <p className="text-xs text-rose-400">Permission denied: You are a guest in Rahul&apos;s workspace. Full access granted upon hiring.</p>;
        break;

      default:
        res = (
          <p className="text-xs text-rose-400">
            Command not recognized: &apos;{trimmed}&apos;. Type <span className="text-amber-400 font-bold">help</span> for available commands.
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
    <div className="fixed bottom-6 right-6 z-[9990] w-full max-w-xl max-h-[85vh] flex flex-col bg-[#0b0b12] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden font-mono text-neutral-200 animate-in slide-in-from-bottom-5 duration-200">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#12121c] border-b border-white/10 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-neutral-300">rahul@workspace: ~</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10"
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
            <div className="flex items-center gap-2 text-cyan-400/90 font-bold">
              <span>❯</span>
              <span>{item.command}</span>
            </div>
            <div className="pl-4">{item.response}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0e0e16] border-t border-white/10">
        <span className="text-cyan-400 font-bold text-sm">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command..."
          className="w-full bg-transparent text-white focus:outline-none text-xs font-mono"
        />
        <button
          onClick={() => handleCommand(input)}
          className="text-neutral-500 hover:text-cyan-400 p-1"
          title="Execute"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
export default DeveloperTerminal;
