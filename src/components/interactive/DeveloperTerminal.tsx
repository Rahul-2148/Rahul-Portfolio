'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  CornerDownLeft,
  Maximize2,
  Minimize2,
  Trash2,
  Volume2,
  VolumeX,
  ExternalLink,
  Code2,
  Sparkles,
  Zap,
  HelpCircle,
  Activity,
  Copy,
  Check,
  Download,
  Sun,
  Moon,
} from 'lucide-react';
import {
  projects,
  personalInfo,
  skills,
  educations,
  achievements,
  experiences,
} from '@/lib/data/portfolio';
import { toggleTheme, getStoredTheme, setTheme, ThemeMode } from '@/lib/theme';

interface CommandOutput {
  id: string;
  command: string;
  timestamp: string;
  response: React.ReactNode;
  durationMs?: number;
  isError?: boolean;
}

const COMMAND_LIST = [
  'help',
  'neofetch',
  'sysinfo',
  'projects',
  'skills',
  'experience',
  'education',
  'achievements',
  'cv',
  'resume',
  'git log',
  'git status',
  'curl /api/health',
  'curl /api/resumes',
  'ping',
  'matrix',
  'whoami',
  'contact',
  'theme',
  'admin',
  'audio',
  'fortune',
  'uptime',
  'date',
  'history',
  'clear',
  'exit',
  'sudo',
];

const QUICK_CHIPS = [
  { label: '🚀 neofetch', cmd: 'neofetch' },
  { label: '📦 projects', cmd: 'projects' },
  { label: '⚡ skills', cmd: 'skills' },
  { label: '📄 cv vault', cmd: 'cv' },
  { label: '🌿 git log', cmd: 'git log' },
  { label: '🌐 curl health', cmd: 'curl /api/health' },
  { label: '👾 matrix', cmd: 'matrix' },
  { label: '❓ help', cmd: 'help' },
  { label: '🧹 clear', cmd: 'clear' },
];

const FORTUNES = [
  '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"Deleted code is debugged code." — Jeff Sickel',
  '"The best performance improvement is the transition from the nonworking state to the working state." — John Ousterhout',
  '"Distributed systems are about embracing failure gracefully." — Rahul Raj',
];

function createInitWelcomeMessage(isLight: boolean): CommandOutput {
  return {
    id: 'init',
    command: 'init --session',
    timestamp: 'SYSTEM',
    response: (
      <div className="space-y-1.5 font-mono text-xs">
        <div className={`font-bold flex items-center gap-2 ${isLight ? 'text-indigo-600' : 'text-emerald-400'}`}>
          <span>⚡ Rahul Raj — Developer Console</span>
          <span className={`text-[10px] px-2 py-0.2 rounded-full border ${
            isLight 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}>
            CONNECTED
          </span>
        </div>
        <p className={isLight ? 'text-slate-600 leading-relaxed' : 'text-slate-400 leading-relaxed'}>
          Welcome to the interactive engineering CLI. Type{' '}
          <span className={`font-bold ${isLight ? 'text-indigo-700' : 'text-primary'}`}>help</span> to explore capabilities or{' '}
          <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>neofetch</span> for complete architecture specs.
        </p>
        <div className={`flex flex-wrap gap-2 text-[11px] pt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          <span>[Tab] Autocomplete</span>
          <span>•</span>
          <span>[↑/↓] History</span>
          <span>•</span>
          <span>[Esc] Close</span>
          <span>•</span>
          <span>[Ctrl+L] Clear</span>
        </div>
      </div>
    ),
  };
}

export function DeveloperTerminal({ initialOpen = false }: { initialOpen?: boolean } = {}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMaximized, setIsMaximized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  
  // Synchronous theme initialization: eliminates initial dark-to-light flash
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const docTheme = document.documentElement.getAttribute('data-theme');
      return docTheme === 'light' || document.documentElement.classList.contains('light') || getStoredTheme() === 'light';
    }
    return false;
  });

  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [tempInput, setTempInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pre-populated initial history on frame 0 matching the active theme
  const [history, setHistory] = useState<CommandOutput[]>(() => {
    const isLight =
      typeof window !== 'undefined'
        ? document.documentElement.getAttribute('data-theme') === 'light' ||
          document.documentElement.classList.contains('light') ||
          getStoredTheme() === 'light'
        : false;
    return [createInitWelcomeMessage(isLight)];
  });

  // Synchronize active theme cleanly without multiple redundant re-renders
  useEffect(() => {
    const applyTheme = (isLight: boolean) => {
      setIsLightMode((prev) => {
        if (prev !== isLight) {
          setHistory((historyPrev) =>
            historyPrev.map((item) => (item.id === 'init' ? createInitWelcomeMessage(isLight) : item))
          );
          return isLight;
        }
        return prev;
      });
    };

    const handleThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<ThemeMode>).detail;
      applyTheme(detail === 'light');
    };

    window.addEventListener('theme-changed', handleThemeChange);

    const observer = new MutationObserver(() => {
      const isLight =
        document.documentElement.getAttribute('data-theme') === 'light' ||
        document.documentElement.classList.contains('light');
      applyTheme(isLight);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const bottomRef = useRef<HTMLDivElement>(null);
  const terminalLogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize and awaken AudioContext on user interaction
  const getAudioContext = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  // Play crisp, authentic mechanical keystroke audio
  const playClick = useCallback(
    (frequency = 600, type: OscillatorType = 'triangle', volume = 0.08) => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.035);

        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
      } catch {
        // Ignore audio failures
      }
    },
    [soundEnabled, getAudioContext]
  );

  // Sound toggle handler with instant audible chime feedback
  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        try {
          const ctx = getAudioContext();
          if (ctx) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, ctx.currentTime);
            osc.frequency.setValueAtTime(780, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.09, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.13);
          }
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  // Global listeners (toggle-terminal and Ctrl+` shortcut)
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('toggle-terminal', handleToggle);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('toggle-terminal', handleToggle);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Focus and auto-scroll on change (contained strictly inside terminal, no window scrolling)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      if (terminalLogRef.current) {
        terminalLogRef.current.scrollTo({
          top: terminalLogRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [isOpen, history]);

  // Matrix Digital Rain effect
  useEffect(() => {
    if (!matrixActive || !isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const characters = '0123456789ABCDEFRAHULRAJMODI<>[]{}+-*=~#';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = isLightMode ? 'rgba(248, 250, 252, 0.08)' : 'rgba(10, 13, 20, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isLightMode ? '#059669' : '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [matrixActive, isOpen, isLightMode]);

  // Copy output snippet
  const handleCopy = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Main Command Dispatcher
  const handleCommand = async (cmdToRun: string) => {
    const rawCmd = cmdToRun.trim();
    if (!rawCmd) return;

    playClick(900, 'square');

    // Update command history
    setCommandHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);
    setInput('');

    const parts = rawCmd.split(/\s+/);
    const primary = parts[0].toLowerCase();
    const args = parts.slice(1);
    const now = new Date().toLocaleTimeString();
    const startTime = performance.now();

    let res: React.ReactNode;
    let isError = false;

    // Theme color helpers for command output
    const cardBg = isLightMode ? 'bg-white border-slate-200 text-slate-800 shadow-2xs' : 'bg-[#111726]/90 border-slate-800 text-slate-200';
    const tagBg = isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#172033] border-slate-700 text-slate-300';
    const primaryTextColor = isLightMode ? 'text-indigo-600' : 'text-primary';
    const subtextColor = isLightMode ? 'text-slate-600' : 'text-slate-400';
    const headTextColor = isLightMode ? 'text-slate-900' : 'text-white';

    switch (primary) {
      case 'help':
      case '?':
        res = (
          <div className="space-y-3 text-xs font-mono">
            <div className={`p-3 rounded-xl border flex items-center justify-between ${cardBg}`}>
              <div>
                <span className={`font-bold ${primaryTextColor}`}>SYSTEM MANUAL &amp; COMMAND DIRECTORY</span>
                <p className={`text-[11px] mt-0.5 ${subtextColor}`}>
                  Available interactive operations for inspection and simulation.
                </p>
              </div>
              <HelpCircle className={`w-5 h-5 shrink-0 ${primaryTextColor}`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Category: System & Identity */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${cardBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  <Activity className="w-3 h-3" /> Core &amp; Identity
                </span>
                <div className={`space-y-1 ${subtextColor}`}>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>neofetch</span> /{' '}
                    <span className={`font-bold ${headTextColor}`}>sysinfo</span> — Comprehensive workstation specs
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>about</span> — Bio, core principles &amp; background
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>whoami</span> — Current visitor session diagnostic
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>contact</span> — Email, social links &amp; coordinates
                  </div>
                </div>
              </div>

              {/* Category: Engineering Portfolio */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${cardBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${isLightMode ? 'text-cyan-700' : 'text-cyan-400'}`}>
                  <Code2 className="w-3 h-3" /> Portfolio &amp; Stack
                </span>
                <div className={`space-y-1 ${subtextColor}`}>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>projects [--all]</span> — Flagships &amp; systems
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>skills</span> — Categorized engineering tech stack
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>cv</span> /{' '}
                    <span className={`font-bold ${headTextColor}`}>resume</span> — View &amp; download curated resumes
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>architecture</span> — Distributed system blueprints
                  </div>
                </div>
              </div>

              {/* Category: Credentials & History */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${cardBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${isLightMode ? 'text-purple-700' : 'text-purple-400'}`}>
                  <Sparkles className="w-3 h-3" /> Career &amp; Track Record
                </span>
                <div className={`space-y-1 ${subtextColor}`}>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>experience</span> — Professional roles &amp; impacts
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>education</span> — B.Tech honors, scores &amp; college
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>achievements</span> — Hackathons, certs &amp; awards
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>git log</span> — Git commits timeline
                  </div>
                </div>
              </div>

              {/* Category: Tools & Utilities */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${cardBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`}>
                  <Zap className="w-3 h-3" /> Utilities &amp; Fun
                </span>
                <div className={`space-y-1 ${subtextColor}`}>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>curl &lt;endpoint&gt;</span> — Live HTTP client request
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>ping &lt;host&gt;</span> — ICMP packet latency test
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>matrix</span> — Toggle Matrix digital rain
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>theme [dark|light]</span> — Toggle UI theme
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>audio</span> — Toggle terminal keystroke sound
                  </div>
                  <div>
                    <span className={`font-bold ${headTextColor}`}>clear</span> / <span className={`font-bold ${headTextColor}`}>exit</span> — Screen management
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'neofetch':
      case 'sysinfo':
        res = (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-mono py-2">
            {/* ASCII Art Logo */}
            <div className={`md:col-span-5 leading-tight select-none ${isLightMode ? 'text-indigo-600' : 'text-emerald-400'}`}>
              <pre className="text-[11px] font-bold">
{`   ██████╗  █████╗ ██╗  ██╗██╗   ██╗██╗     
   ██╔══██╗██╔══██╗██║  ██║██║   ██║██║     
   ██████╔╝███████║███████║██║   ██║██║     
   ██╔══██╗██╔══██║██╔══██║██║   ██║██║     
   ██║  ██║██║  ██║██║  ██║╚██████╔╝███████╗
   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝`}
              </pre>
              <div className={`mt-2 text-center md:text-left text-[11px] ${subtextColor}`}>
                Rahul Raj Modi • Enterprise Architecture
              </div>
              <div className="flex gap-1.5 mt-2 justify-center md:justify-start">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
                <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block shadow-xs" />
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block shadow-xs" />
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block shadow-xs" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs" />
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-xs" />
              </div>
            </div>

            {/* Spec breakdown */}
            <div className={`md:col-span-7 space-y-1 leading-relaxed ${subtextColor}`}>
              <div className={`font-bold border-b pb-1 mb-1.5 ${headTextColor} ${isLightMode ? 'border-slate-200' : 'border-slate-800'}`}>
                rahul@portfolio-v4
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>OS:</span> Next.js 16.3.5 (Turbopack Engine)
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>Host:</span> Vercel Global Edge Network
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>Kernel:</span> Node.js 22 LTS / React 19 Strict
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>Uptime:</span> 99.98% High Availability SLA
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>Shell:</span> rahul-zsh 5.9 (x86_64-darwin/linux)
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>Role:</span> {personalInfo.role} ({personalInfo.tagline})
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>Database:</span> MongoDB Atlas Cluster + Redis Cache
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>Media Pipeline:</span> Global Edge CDN Delivery
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>CPU:</span> 8-Core Distributed Edge Nodes
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>Memory:</span> 64.2 MB / 512 MB (Serverless RAM)
              </div>
              <div>
                <span className={`font-bold ${isLightMode ? 'text-indigo-700' : 'text-emerald-400'}`}>Location:</span> {personalInfo.location} (Available Globally)
              </div>
            </div>
          </div>
        );
        break;

      case 'projects': {
        const isAll = args.includes('--all');
        const displayProjects = isAll ? projects : projects.slice(0, 5);

        res = (
          <div className="space-y-3 text-xs font-mono">
            <div className={`flex items-center justify-between ${subtextColor}`}>
              <span>
                Engineered Deployments ({displayProjects.length} of {projects.length})
              </span>
              {!isAll && (
                <span className={`text-[11px] ${primaryTextColor}`}>
                  Hint: type &apos;projects --all&apos; for complete catalog
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {displayProjects.map((p) => (
                <div
                  key={p.slug}
                  className={`p-3 rounded-xl border transition-all space-y-1.5 ${cardBg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-sm flex items-center gap-1.5 ${headTextColor}`}>
                      <span>{p.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                        isLightMode 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                          : 'bg-primary/10 border-primary/20 text-primary'
                      }`}>
                        Tier {p.tier}
                      </span>
                    </span>
                    <span className={`text-[10px] ${subtextColor}`}>{p.category}</span>
                  </div>

                  <p className={`text-[11px] line-clamp-2 ${subtextColor}`}>{p.tagline}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className={`text-[9px] px-1.5 py-0.2 rounded border ${tagBg}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className={`pt-2 flex items-center justify-between border-t text-[11px] ${isLightMode ? 'border-slate-100' : 'border-slate-800'}`}>
                    <a
                      href={`/work/${p.slug}`}
                      className={`${primaryTextColor} hover:underline flex items-center gap-1 font-semibold`}
                    >
                      <span>Case Study</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {p.links?.live && (
                      <a
                        href={p.links.live}
                        target="_blank"
                        rel="noreferrer"
                        className={`${isLightMode ? 'text-emerald-700' : 'text-emerald-400'} hover:underline flex items-center gap-1 font-semibold`}
                      >
                        <span>Try Now</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;
      }

      case 'skills': {
        const categories = Array.from(new Set(skills.map((s) => s.category)));

        res = (
          <div className="space-y-3 text-xs font-mono">
            <div className={`font-bold ${headTextColor}`}>
              Engineering Competencies ({skills.length} verified technologies):
            </div>

            <div className="space-y-2.5">
              {categories.map((cat) => {
                const catSkills = skills.filter((s) => s.category === cat);
                return (
                  <div key={cat} className="space-y-1">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${primaryTextColor}`}>
                      ├─ {cat} ({catSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 pl-4">
                      {catSkills.map((s) => (
                        <span
                          key={s.name}
                          className={`px-2 py-0.5 rounded-lg border text-[11px] flex items-center gap-1 ${tagBg}`}
                        >
                          <span>{s.name}</span>
                          {s.level === 'core' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Core Mastery" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
        break;
      }

      case 'cv':
      case 'resume':
      case 'cat resume':
        res = (
          <div className={`p-4 rounded-2xl border space-y-3 text-xs font-mono ${cardBg}`}>
            <div className={`flex items-center justify-between border-b pb-2.5 ${isLightMode ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2">
                <Download className={`w-4 h-4 ${primaryTextColor}`} />
                <span className={`font-bold ${headTextColor}`}>CURATED RESUME VAULT</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                isLightMode 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
              }`}>
                VERIFIED DOCUMENT
              </span>
            </div>

            <p className={`leading-relaxed ${subtextColor}`}>
              Official resume documents available for review and download:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.dispatchEvent(new CustomEvent('open-resume-modal'));
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-90 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-purple-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Launch CV Viewer Modal</span>
              </button>
              <a
                href="/resume"
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-colors ${tagBg}`}
              >
                <span>Printable ATS Web Resume</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        );
        break;

      case 'git': {
        const sub = args[0];
        if (sub === 'log') {
          res = (
            <div className="space-y-3 text-xs font-mono">
              <div className={subtextColor}>Recent Git Commits (main branch):</div>
              <div className={`space-y-2 border-l-2 pl-3 ${isLightMode ? 'border-indigo-300' : 'border-primary/40'}`}>
                <div className="space-y-0.5">
                  <div className="text-amber-500 font-bold">
                    commit 9b4d812{' '}
                    <span className={`text-[10px] font-normal ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
                      (HEAD -&gt; main, origin/main)
                    </span>
                  </div>
                  <div className={`text-[11px] ${subtextColor}`}>
                    Author: Rahul Raj &lt;rahulraj21480@gmail.com&gt;
                  </div>
                  <div className={headTextColor}>
                    feat: Interactive resume viewer &amp; verified document vault
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-amber-500 font-bold">commit 4e11fa3</div>
                  <div className={`text-[11px] ${subtextColor}`}>
                    Author: Rahul Raj &lt;rahulraj21480@gmail.com&gt;
                  </div>
                  <div className={headTextColor}>
                    fix: modal wheel &amp; touch scroll containment with Lenis bypass
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-amber-500 font-bold">commit a8201fe</div>
                  <div className={`text-[11px] ${subtextColor}`}>
                    Author: Rahul Raj &lt;rahulraj21480@gmail.com&gt;
                  </div>
                  <div className={headTextColor}>
                    feat: Warp-grade developer CLI terminal with Starship shell &amp; matrix mode
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-amber-500 font-bold">commit 6c308bb</div>
                  <div className={`text-[11px] ${subtextColor}`}>
                    Author: Rahul Raj &lt;rahulraj21480@gmail.com&gt;
                  </div>
                  <div className={headTextColor}>
                    feat: Realtime visitor presence, geolocations &amp; live telemetry
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (sub === 'status') {
          res = (
            <div className={`space-y-1.5 text-xs font-mono ${subtextColor}`}>
              <p>On branch <span className={`font-bold ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>main</span></p>
              <p>Your branch is up to date with &apos;origin/main&apos;.</p>
              <p className={isLightMode ? 'text-emerald-700' : 'text-emerald-400'}>nothing to commit, working tree clean</p>
            </div>
          );
        } else {
          res = (
            <div className={`text-xs font-mono ${subtextColor}`}>
              git usage: <span className={primaryTextColor}>git log</span> |{' '}
              <span className={primaryTextColor}>git status</span>
            </div>
          );
        }
        break;
      }

      case 'curl': {
        const target = args[0] || '/api/health';
        try {
          const fetchRes = await fetch(target);
          const json = await fetchRes.json().catch(() => null);
          const statusText = fetchRes.statusText || 'OK';

          res = (
            <div className="space-y-2 text-xs font-mono">
              <div className={`font-bold flex items-center justify-between ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
                <span>HTTP/2 {fetchRes.status} {statusText}</span>
                <span className={`text-[11px] ${subtextColor}`}>{target}</span>
              </div>
              <div className={`text-[11px] ${subtextColor}`}>
                content-type: application/json; charset=utf-8
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 overflow-x-auto shadow-inner">
                <pre>{JSON.stringify(json, null, 2)}</pre>
              </div>
            </div>
          );
        } catch {
          res = (
            <div className="text-xs font-mono text-destructive">
              curl: (7) Failed to connect to host or endpoint: {target}
            </div>
          );
          isError = true;
        }
        break;
      }

      case 'ping': {
        const host = args[0] || 'portfolio.vercel.app';
        res = (
          <div className={`space-y-1 text-xs font-mono ${subtextColor}`}>
            <p className={headTextColor}>PING {host} (76.76.21.21): 56 data bytes</p>
            <p>64 bytes from 76.76.21.21: icmp_seq=0 ttl=58 time=14.320 ms</p>
            <p>64 bytes from 76.76.21.21: icmp_seq=1 ttl=58 time=13.884 ms</p>
            <p>64 bytes from 76.76.21.21: icmp_seq=2 ttl=58 time=14.105 ms</p>
            <p>64 bytes from 76.76.21.21: icmp_seq=3 ttl=58 time=13.910 ms</p>
            <p className={`font-bold pt-1 ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
              --- {host} ping statistics --- 4 packets transmitted, 4 received, 0.0% packet loss
            </p>
          </div>
        );
        break;
      }

      case 'matrix':
        setMatrixActive((prev) => !prev);
        res = (
          <div className={`text-xs font-mono ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
            {matrixActive
              ? 'Matrix digital rain simulation terminated.'
              : 'Matrix digital rain engaged. Type matrix again to disable.'}
          </div>
        );
        break;

      case 'audio':
        setSoundEnabled((prev) => !prev);
        res = (
          <div className={`text-xs font-mono ${primaryTextColor}`}>
            Mechanical keystroke sound: {!soundEnabled ? 'ENABLED' : 'DISABLED'}
          </div>
        );
        break;

      case 'experience':
        res = (
          <div className="space-y-3 text-xs font-mono">
            <div className={`font-bold ${headTextColor}`}>Professional Experience:</div>
            {experiences.map((exp, idx) => (
              <div key={idx} className={`p-3 rounded-xl border space-y-1.5 ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${headTextColor}`}>
                    {exp.role} @ {exp.company}
                  </span>
                  <span className={`text-[11px] ${primaryTextColor}`}>{exp.duration}</span>
                </div>
                <p className={`text-xs ${subtextColor}`}>{exp.description}</p>
                <div className="space-y-1 pt-1 text-[11px]">
                  {exp.achievements.map((ach, i) => (
                    <div key={i} className={`flex items-start gap-1.5 ${subtextColor}`}>
                      <span className={primaryTextColor}>▸</span>
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case 'education':
        res = (
          <div className="space-y-3 text-xs font-mono">
            <div className={`font-bold ${headTextColor}`}>Academic Credentials:</div>
            {educations.map((edu, idx) => (
              <div key={idx} className={`p-3 rounded-xl border space-y-1 ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${headTextColor}`}>{edu.degree}</span>
                  <span className={`font-bold ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>{edu.score}</span>
                </div>
                <div className={`text-xs ${subtextColor}`}>{edu.institution}</div>
                <div className={`text-[11px] ${subtextColor}`}>{edu.duration}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'achievements':
        res = (
          <div className="space-y-2 text-xs font-mono">
            <div className={`font-bold ${headTextColor}`}>Key Honors &amp; Hackathons:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {achievements.map((ach) => (
                <div key={ach.id} className={`p-2.5 rounded-xl border space-y-1 ${cardBg}`}>
                  <div className={`font-bold ${headTextColor}`}>{ach.title}</div>
                  <div className={`text-[11px] ${primaryTextColor}`}>{ach.issuer} ({ach.date})</div>
                  <p className={`text-[10px] line-clamp-2 ${subtextColor}`}>{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'about':
        res = (
          <div className={`space-y-2 text-xs font-mono leading-relaxed ${subtextColor}`}>
            <p className={`font-bold text-sm ${headTextColor}`}>
              {personalInfo.name} — {personalInfo.role}
            </p>
            <p>{personalInfo.bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div><span className={primaryTextColor}>Email:</span> {personalInfo.email}</div>
              <div><span className={primaryTextColor}>Location:</span> {personalInfo.location}</div>
              <div><span className={primaryTextColor}>Degree:</span> B.Tech in CSE (Distinction)</div>
              <div><span className={primaryTextColor}>Specialty:</span> Next.js, Node.js, MongoDB, WebSockets</div>
            </div>
          </div>
        );
        break;

      case 'contact':
        res = (
          <div className={`p-3 rounded-xl border space-y-2 text-xs font-mono ${cardBg}`}>
            <span className={`font-bold ${headTextColor}`}>Direct Telemetry Channels:</span>
            <div className={`space-y-1 ${subtextColor}`}>
              <div>
                Email:{' '}
                <a href={`mailto:${personalInfo.email}`} className={`${primaryTextColor} underline`}>
                  {personalInfo.email}
                </a>
              </div>
              <div>
                GitHub:{' '}
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className={`${primaryTextColor} underline`}>
                  {personalInfo.github}
                </a>
              </div>
              {personalInfo.linkedin && (
                <div>
                  LinkedIn:{' '}
                  <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className={`${primaryTextColor} underline`}>
                    {personalInfo.linkedin}
                  </a>
                </div>
              )}
              {personalInfo.twitter && (
                <div>
                  Twitter / X:{' '}
                  <a href={personalInfo.twitter} target="_blank" rel="noreferrer" className={`${primaryTextColor} underline`}>
                    {personalInfo.twitter}
                  </a>
                </div>
              )}
              {personalInfo.instagram && (
                <div>
                  Instagram:{' '}
                  <a href={personalInfo.instagram} target="_blank" rel="noreferrer" className={`${primaryTextColor} underline`}>
                    {personalInfo.instagram}
                  </a>
                </div>
              )}
              {personalInfo.leetcode && (
                <div>
                  LeetCode:{' '}
                  <a href={personalInfo.leetcode} target="_blank" rel="noreferrer" className={`${primaryTextColor} underline`}>
                    {personalInfo.leetcode}
                  </a>
                </div>
              )}
              {personalInfo.codeforces && (
                <div>
                  Codeforces:{' '}
                  <a href={personalInfo.codeforces} target="_blank" rel="noreferrer" className={`${primaryTextColor} underline`}>
                    {personalInfo.codeforces}
                  </a>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/contact');
              }}
              className="mt-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span>Open Contact Transmission Form</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        );
        break;

      case 'whoami': {
        const guestId =
          typeof window !== 'undefined' ? localStorage.getItem('pv_guest_id') || 'guest_evaluator' : 'guest';
        res = (
          <div className={`space-y-1 text-xs font-mono ${subtextColor}`}>
            <p>Visitor Principal: <span className={`font-bold ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>{guestId}</span></p>
            <p>Access Level: <span className={isLightMode ? 'text-cyan-700 font-semibold' : 'text-cyan-400 font-semibold'}>Recruiter / Client Evaluator</span></p>
            <p>Terminal Session: <span className={primaryTextColor}>Authorized (Read-Only System Explorer)</span></p>
          </div>
        );
        break;
      }

      case 'sudo':
        res = (
          <div className="text-xs font-mono text-destructive">
            [sudo] password for guest: Permission denied. Incident reported to Rahul Raj.
          </div>
        );
        isError = true;
        break;

      case 'theme': {
        const requested = args[0]?.toLowerCase();
        let nextTheme: ThemeMode = getStoredTheme();
        if (requested === 'dark' || requested === 'light') {
          setTheme(requested);
          nextTheme = requested;
        } else {
          nextTheme = toggleTheme();
        }
        setIsLightMode(nextTheme === 'light');
        res = (
          <div className={`text-xs font-mono ${primaryTextColor}`}>
            Active interface theme set to: <span className="font-bold uppercase">{nextTheme}</span>
          </div>
        );
        break;
      }

      case 'fortune':
      case 'quote': {
        const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        res = <div className={`text-xs font-mono italic ${isLightMode ? 'text-purple-700' : 'text-purple-300'}`}>{quote}</div>;
        break;
      }

      case 'uptime':
        res = (
          <div className={`text-xs font-mono ${subtextColor}`}>
            up 42 days, 14 hours, 28 minutes, 1 user, load average: 0.12, 0.08, 0.05
          </div>
        );
        break;

      case 'date':
        res = (
          <div className={`text-xs font-mono ${subtextColor}`}>
            {new Date().toUTCString()} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
          </div>
        );
        break;

      case 'history':
        res = (
          <div className={`space-y-1 text-xs font-mono ${subtextColor}`}>
            {commandHistory.length === 0 ? (
              <p>No previous commands in this session.</p>
            ) : (
              commandHistory.map((h, i) => (
                <div key={i}>
                  <span className={primaryTextColor}>{i + 1}</span> {h}
                </div>
              ))
            )}
          </div>
        );
        break;

      case 'admin':
        router.push('/admin');
        setIsOpen(false);
        return;

      case 'clear':
      case 'cls':
        setHistory([]);
        return;

      case 'exit':
      case 'quit':
        setIsOpen(false);
        return;

      default:
        res = (
          <div className="text-xs font-mono text-destructive">
            zsh: command not found: <span className="font-bold">{rawCmd}</span>. Type{' '}
            <span className={`font-bold ${primaryTextColor}`}>help</span> to view available instructions.
          </div>
        );
        isError = true;
    }

    const durationMs = Math.round(performance.now() - startTime);

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        command: rawCmd,
        timestamp: now,
        response: res,
        durationMs,
        isError,
      },
    ]);
  };

  // Keyboard navigation: Enter, Esc, Tab, ArrowUp, ArrowDown & Typing Sound
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Play keystroke click for all typable and navigation keys
    if (
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      e.key !== 'Shift' &&
      e.key !== 'Control' &&
      e.key !== 'Alt' &&
      e.key !== 'Meta' &&
      e.key !== 'Enter' &&
      e.key !== 'Escape'
    ) {
      // Natural mechanical keyboard pitch variation (550 - 750Hz)
      const freq = 550 + Math.random() * 200;
      playClick(freq, 'triangle', 0.08);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      playClick(850, 'square', 0.1);
      handleCommand(input);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      playClick(450, 'triangle', 0.05);
      setIsOpen(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      playClick(640, 'triangle', 0.06);
      if (commandHistory.length === 0) return;
      if (historyIndex === -1) {
        setTempInput(input);
      }
      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      playClick(640, 'triangle', 0.06);
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput(tempInput);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      playClick(720, 'triangle', 0.08);
      if (!input.trim()) return;

      const matches = COMMAND_LIST.filter((c) =>
        c.startsWith(input.toLowerCase().trim())
      );

      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        // Output matching suggestions
        setHistory((prev) => [
          ...prev,
          {
            id: `tab-${Date.now()}`,
            command: input,
            timestamp: new Date().toLocaleTimeString(),
            response: (
              <div className={`flex flex-wrap gap-2 text-xs font-mono ${isLightMode ? 'text-indigo-700' : 'text-cyan-400'}`}>
                {matches.map((m) => (
                  <span key={m} className={`px-2 py-0.5 rounded border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-surface border-border'}`}>
                    {m}
                  </span>
                ))}
              </div>
            ),
          },
        ]);
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setHistory([]);
    }
  };

  const handleToggleTerminalTheme = () => {
    const next = toggleTheme();
    const isLight = next === 'light';
    setIsLightMode(isLight);
    setHistory((prev) =>
      prev.map((item) => (item.id === 'init' ? createInitWelcomeMessage(isLight) : item))
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        data-lenis-prevent
        className={`w-full font-mono flex flex-col overscroll-contain transition-[height,max-height,max-width] duration-200 relative rounded-none sm:rounded-2xl md:rounded-3xl overflow-hidden ${
          isMaximized
            ? 'h-[100dvh] sm:h-[96vh] max-w-full sm:max-w-[98vw]'
            : 'h-[100dvh] sm:h-[84vh] sm:max-h-[88vh] max-w-full sm:max-w-4xl md:max-w-5xl'
        } ${
          isLightMode
            ? 'bg-slate-50/98 text-slate-900 border border-slate-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18),0_0_30px_rgba(99,102,241,0.1)]'
            : 'bg-[#0a0d14]/95 text-slate-100 border border-emerald-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.12)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Matrix Canvas Layer (if enabled) */}
        {matrixActive && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none opacity-25 z-0"
          />
        )}

        {/* Title Bar with macOS Traffic Light Controls */}
        <div className={`flex items-center justify-between px-4 py-3 border-b shrink-0 z-10 select-none ${
          isLightMode 
            ? 'bg-slate-100 border-slate-200 text-slate-800' 
            : 'bg-[#0f141f] border-slate-800 text-slate-200'
        }`}>
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:brightness-110 flex items-center justify-center transition-all cursor-pointer group"
              title="Close terminal (Esc)"
            >
              <X className="w-2.5 h-2.5 text-rose-950 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onClick={() => setHistory([])}
              className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:brightness-110 flex items-center justify-center transition-all cursor-pointer group"
              title="Clear screen (Ctrl+L)"
            >
              <Trash2 className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onClick={() => setIsMaximized((prev) => !prev)}
              className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:brightness-110 flex items-center justify-center transition-all cursor-pointer group"
              title="Toggle full-height window"
            >
              {isMaximized ? (
                <Minimize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100" />
              ) : (
                <Maximize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100" />
              )}
            </button>

            <div className={`ml-3 hidden sm:flex items-center gap-2 text-xs font-mono ${
              isLightMode ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`font-bold ${isLightMode ? 'text-slate-900' : 'text-slate-200'}`}>rahul@cluster-01</span>
              <span>:</span>
              <span className={`font-semibold ${isLightMode ? 'text-indigo-600' : 'text-primary'}`}>~/portfolio</span>
              <span className={isLightMode ? 'text-slate-500' : 'text-slate-500'}>⎇ (main⚡)</span>
            </div>
          </div>

          {/* Right Header Affordances */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            {/* Quick Theme Toggle Button */}
            <button
              onClick={handleToggleTerminalTheme}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isLightMode
                  ? 'bg-white hover:bg-slate-200 text-amber-600 border-slate-300'
                  : 'bg-surface hover:bg-muted text-primary border-border'
              }`}
              title={`Switch site to ${isLightMode ? 'Dark' : 'Light'} Mode`}
            >
              {isLightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Keystroke Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                soundEnabled
                  ? isLightMode
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    : 'bg-primary/20 text-primary border-primary/40'
                  : isLightMode
                  ? 'bg-white hover:bg-slate-200 text-slate-600 border-slate-300'
                  : 'bg-surface hover:bg-muted text-muted-foreground border-border'
              }`}
              title={soundEnabled ? 'Mute keystroke sound' : 'Enable keystroke click sound'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Matrix Rain Toggle */}
            <button
              onClick={() => setMatrixActive((prev) => !prev)}
              className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                matrixActive
                  ? isLightMode
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-xs'
                  : isLightMode
                  ? 'bg-white hover:bg-slate-200 text-slate-600 border-slate-300'
                  : 'bg-surface hover:bg-muted text-muted-foreground border-border'
              }`}
              title="Toggle Matrix Digital Rain"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Matrix</span>
            </button>

            {/* Maximize Toggle */}
            <button
              onClick={() => setIsMaximized((prev) => !prev)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer hidden sm:flex ${
                isLightMode
                  ? 'bg-white hover:bg-slate-200 text-slate-600 border-slate-300'
                  : 'bg-surface hover:bg-muted border-border text-muted-foreground hover:text-foreground'
              }`}
              title="Expand / Minimize Height"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLightMode
                  ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output Log Container */}
        <div
          ref={terminalLogRef}
          data-lenis-prevent
          className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs overscroll-contain touch-pan-y z-10 ${
            isLightMode 
              ? 'text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-900' 
              : 'text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200'
          }`}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-1.5 group">
              {/* Starship Prompt Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`font-bold ${isLightMode ? 'text-indigo-600' : 'text-emerald-400'}`}>
                    ┌─[rahul@portfolio]
                  </span>
                  <span className={isLightMode ? 'text-cyan-700 font-medium' : 'text-cyan-400'}>
                    ~/work
                  </span>
                  <span className="text-slate-500">⎇ main</span>
                  <span className={`font-bold ${isLightMode ? 'text-indigo-600' : 'text-primary'}`}>
                    ❯
                  </span>
                  <span className={`font-bold ${isLightMode ? 'text-slate-950' : 'text-white'}`}>
                    {item.command}
                  </span>
                </div>

                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  {item.durationMs !== undefined && (
                    <span className={`text-[10px] ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.durationMs}ms
                    </span>
                  )}
                  <span className={`text-[10px] ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.timestamp}
                  </span>
                  <button
                    onClick={() => handleCopy(item.id, item.command)}
                    className={`p-1 rounded ${isLightMode ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-surface text-slate-400 hover:text-white'}`}
                    title="Copy command"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Execution Output */}
              <div className={`pl-4 sm:pl-5 border-l-2 leading-relaxed ${
                isLightMode 
                  ? 'border-indigo-400/40 text-slate-800' 
                  : 'border-primary/20 text-slate-200'
              }`}>
                {item.response}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick Action Chips Bar */}
        <div className={`px-4 py-2 border-t flex items-center gap-1.5 overflow-x-auto scrollbar-none z-10 text-[11px] font-mono shrink-0 ${
          isLightMode 
            ? 'bg-slate-100 border-slate-200' 
            : 'bg-[#0c1018] border-slate-800/80'
        }`}>
          <span className={`text-[10px] uppercase font-semibold shrink-0 mr-1 flex items-center gap-1 ${
            isLightMode ? 'text-slate-600' : 'text-slate-400'
          }`}>
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Quick:</span>
          </span>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.cmd}
              onClick={() => {
                playClick(680, 'triangle', 0.08);
                handleCommand(chip.cmd);
              }}
              className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
                isLightMode
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-indigo-600 shadow-2xs'
                  : 'bg-[#131b2e] hover:bg-[#1a243d] border-slate-700/60 text-slate-300 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Starship Prompt */}
        <div className={`px-4 py-3 border-t flex items-center gap-2 z-10 shrink-0 font-mono ${
          isLightMode 
            ? 'bg-slate-100/95 border-slate-300' 
            : 'bg-[#0f141f] border-slate-800'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-bold shrink-0">
            <span className={isLightMode ? 'text-indigo-600 font-bold' : 'text-emerald-400 font-bold'}>
              └─❯
            </span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'neofetch', 'projects', 'cv'..."
            className={`flex-1 bg-transparent text-xs font-mono font-medium focus:outline-none ${
              isLightMode
                ? 'text-slate-950 font-bold placeholder:text-slate-400'
                : 'text-emerald-300 font-bold placeholder:text-slate-500'
            }`}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          <button
            onClick={() => handleCommand(input)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLightMode
                ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200'
                : 'bg-primary/20 hover:bg-primary/30 text-primary border-primary/30'
            }`}
            title="Execute command (Enter)"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Status Bar */}
        <div className={`px-4 py-1.5 border-t flex items-center justify-between text-[10px] font-mono shrink-0 z-10 ${
          isLightMode 
            ? 'bg-slate-200/80 border-slate-300 text-slate-600' 
            : 'bg-[#0a0d14] border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`px-1.5 py-0.2 rounded font-bold border ${
              isLightMode
                ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            }`}>
              NORMAL
            </span>
            <span className="hidden sm:inline">Shell: rahul-zsh</span>
            <span>Encoding: UTF-8</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline">Press [Tab] to Autocomplete</span>
            <span>[Esc] to Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperTerminal;
