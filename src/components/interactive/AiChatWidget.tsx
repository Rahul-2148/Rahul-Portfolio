'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  Send,
  X,
  RefreshCw,
  Maximize2,
  Minimize2,
  RotateCcw,
  Mic,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
}

const DEFAULT_SUGGESTIONS = [
  '🏪 Multi-Vendor vs Single-Vendor?',
  '🚀 Zosh Bazaar micro-frontends',
  '⚡ Snapcart real-time tracking',
  '🛠️ Core backend & tech stack',
  '📬 How to contact Rahul?',
];

/* =========================================================================
   SAFE & BEAUTIFUL MARKDOWN RENDERER (ChatGPT / Claude Style)
   ========================================================================= */
function FormattedMessage({ content }: { content: string }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2.5 text-xs sm:text-[13px] leading-relaxed text-foreground font-sans">
      {parts.map((part, pIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : '';
          const code = (hasLang ? lines.slice(1) : lines).join('\n');

          return (
            <div
              key={pIdx}
              className="my-3 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-inner text-neutral-200"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900/80 border-b border-neutral-800 text-[10px] font-mono text-neutral-400">
                <span>{lang || 'code'}</span>
                <button
                  onClick={() => handleCopy(code)}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {copiedCode === code ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono overflow-x-auto leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Render paragraphs, headings, and lists
        const paragraphs = part.split('\n\n');
        return (
          <div key={pIdx} className="space-y-2">
            {paragraphs.map((para, paraIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              // Headings
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={paraIdx} className="text-sm font-bold text-foreground tracking-tight pt-1">
                    {parseInline(trimmed.replace(/^###\s+/, ''))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={paraIdx} className="text-base font-extrabold text-foreground tracking-tight pt-1">
                    {parseInline(trimmed.replace(/^##\s+/, ''))}
                  </h3>
                );
              }

              // List items
              if (trimmed.includes('\n• ') || trimmed.includes('\n- ') || trimmed.startsWith('• ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
                const lines = trimmed.split('\n');
                return (
                  <ul key={paraIdx} className="space-y-1 pl-1">
                    {lines.map((line, lIdx) => {
                      const cleanLine = line.replace(/^([•\-*]|\d+\.)\s+/, '');
                      return (
                        <li key={lIdx} className="flex items-start gap-2">
                          <span className="text-purple-400 font-bold shrink-0 mt-0.5">•</span>
                          <span>{parseInline(cleanLine)}</span>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              return (
                <p key={paraIdx} className="text-foreground/90">
                  {parseInline(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Inline Markdown parser (bold, italic, inline code, links)
function parseInline(text: string) {
  // Split links [title](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(parseFormattedText(text.slice(lastIndex, match.index)));
    }
    const [, label, url] = match;
    elements.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-medium inline-flex items-center gap-0.5"
      >
        <span>{label}</span>
        <ExternalLink className="w-2.5 h-2.5 inline" />
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    elements.push(parseFormattedText(text.slice(lastIndex)));
  }

  return elements.length > 0 ? elements : text;
}

function parseFormattedText(text: string) {
  // Bold & inline code
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-neutral-800/80 text-purple-300 font-mono text-[11px] border border-neutral-700/50"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/* =========================================================================
   FLOATING AI CHAT WIDGET COMPONENT
   ========================================================================= */
export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        `👋 Hi there! I'm **Rahul's AI Assistant**.\n\n` +
        `Ask me anything about his **full-stack projects**, system architecture, tech stack, or background — or tap a question below!`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Pathname for route-based visibility (hide on /admin)
  const pathname = usePathname();

  // Smart Auto-Dismiss Badge: Shows for first 5 seconds, then collapses into sleek icon (re-appears on hover)
  const [showBadge, setShowBadge] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBadge(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Window geometry and control states
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [size, setSize] = useState({ width: 440, height: 640 });
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isCustomPosition, setIsCustomPosition] = useState(false);
  const [prevGeometry, setPrevGeometry] = useState<{
    size: { width: number; height: number };
    position: { x: number; y: number } | null;
    isCustomPosition: boolean;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Whisper-Flow Style Voice Recognition
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Speech Recognition (Client-side, free & open browser standard)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang =
          typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceError(null);
        };

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInput(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Voice recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setVoiceError('Microphone access was denied. Please allow microphone permission.');
          } else if (event.error !== 'no-speech') {
            setVoiceError('Speech not recognized. Please try again.');
          }
          setTimeout(() => setVoiceError(null), 3500);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setVoiceError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      setTimeout(() => setVoiceError(null), 4000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      setVoiceError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  // Window resize handler: strictly prevents any off-screen positioning or page horizontal scroll
  useEffect(() => {
    const handleWindowResize = () => {
      if (typeof window === 'undefined') return;

      // On mobile screens (< 640px), reset to default dock position
      if (window.innerWidth < 640) {
        setIsCustomPosition(false);
        setPosition(null);
        return;
      }

      if (isCustomPosition && position) {
        const maxX = Math.max(8, window.innerWidth - size.width - 8);
        const maxY = Math.max(8, window.innerHeight - size.height - 8);
        const clampedX = Math.min(Math.max(8, position.x), maxX);
        const clampedY = Math.min(Math.max(8, position.y), maxY);
        setPosition({ x: clampedX, y: clampedY });
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isCustomPosition, position, size.width, size.height]);

  // Escape key handler: exit fullscreen first, then close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isFullScreen) {
          setIsFullScreen(false);
          if (prevGeometry) {
            setSize(prevGeometry.size);
            setPosition(prevGeometry.position);
            setIsCustomPosition(prevGeometry.isCustomPosition);
          }
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullScreen, prevGeometry]);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      setPrevGeometry({
        size: { ...size },
        position: position ? { ...position } : null,
        isCustomPosition,
      });
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
      if (prevGeometry) {
        setSize(prevGeometry.size);
        setPosition(prevGeometry.position);
        setIsCustomPosition(prevGeometry.isCustomPosition);
      }
    }
  };

  const resetToDefault = () => {
    setSize({ width: 440, height: 640 });
    setPosition(null);
    setIsCustomPosition(false);
    setIsFullScreen(false);
  };

  const isCustomized =
    isCustomPosition || size.width !== 440 || size.height !== 640 || isFullScreen;

  const handleDragStart = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, a, textarea')) return;
    if (isFullScreen) return;

    e.preventDefault();
    const startPointerX = e.clientX;
    const startPointerY = e.clientY;

    const rect = panelRef.current?.getBoundingClientRect();
    const startX = rect ? rect.left : window.innerWidth - size.width - 24;
    const startY = rect ? rect.top : window.innerHeight - size.height - 96;

    setIsDragging(true);
    setIsCustomPosition(true);

    const onPointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startPointerX;
      const dy = ev.clientY - startPointerY;

      const maxX = Math.max(8, window.innerWidth - size.width - 8);
      const maxY = Math.max(8, window.innerHeight - size.height - 8);

      const clampedX = Math.min(Math.max(8, startX + dx), maxX);
      const clampedY = Math.min(Math.max(8, startY + dy), maxY);

      setPosition({ x: clampedX, y: clampedY });
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleResizeStart = (e: React.PointerEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFullScreen) return;

    const startPointerX = e.clientX;
    const startPointerY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const rect = panelRef.current?.getBoundingClientRect();
    const startX = rect ? rect.left : window.innerWidth - size.width - 24;
    const startY = rect ? rect.top : window.innerHeight - size.height - 96;

    setIsResizing(true);

    const onPointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startPointerX;
      const dy = ev.clientY - startPointerY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startX;
      let newY = startY;

      const minW = Math.min(320, window.innerWidth - 16);
      const minH = Math.min(400, window.innerHeight - 16);

      if (direction.includes('e')) {
        const maxWidthAvailable = window.innerWidth - startX - 8;
        newWidth = Math.max(minW, Math.min(maxWidthAvailable, startWidth + dx));
      }
      if (direction.includes('s')) {
        const maxHeightAvailable = window.innerHeight - startY - 8;
        newHeight = Math.max(minH, Math.min(maxHeightAvailable, startHeight + dy));
      }
      if (direction.includes('w')) {
        const requestedWidth = startWidth - dx;
        const maxWLeft = startX + startWidth - 8;
        const clampedWidth = Math.max(minW, Math.min(maxWLeft, requestedWidth));
        newX = startX + (startWidth - clampedWidth);
        newWidth = clampedWidth;
      }
      if (direction.includes('n')) {
        const requestedHeight = startHeight - dy;
        const maxHTop = startY + startHeight - 8;
        const clampedHeight = Math.max(minH, Math.min(maxHTop, requestedHeight));
        newY = startY + (startHeight - clampedHeight);
        newHeight = clampedHeight;
      }

      setSize({ width: newWidth, height: newHeight });

      if (direction.includes('w') || direction.includes('n') || isCustomPosition) {
        setIsCustomPosition(true);
        setPosition({ x: newX, y: newY });
      }
    };

    const onPointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Auto-hide when resume modal is open
  useEffect(() => {
    const handleModalState = (e: Event) => {
      const custom = e as CustomEvent<{ open: boolean }>;
      setIsResumeModalOpen(Boolean(custom.detail?.open));
    };

    window.addEventListener('resume-modal-state', handleModalState);
    return () => window.removeEventListener('resume-modal-state', handleModalState);
  }, []);

  // Auto-scroll on new message (contained within the chat window, preventing background jumps)
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isThinking, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isThinking) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiReply = data.content || 'I encountered an issue processing your request.';

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiReply,
        timestamp: 'Just now',
        provider: data.provider,
        model: data.model,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content:
          `I apologize, but I had trouble connecting. Here is a direct summary:\n\n` +
          `• **Full-Stack Engineer**: Specialized in MERN, Next.js, Real-Time WebSockets & AI.\n` +
          `• **Flagship Projects**: **Zosh Bazaar** (5 micro-frontends marketplace) & **Snapcart** (10-min grocery delivery).\n` +
          `• **Direct Email**: [rahulraj21480@gmail.com](mailto:rahulraj21480@gmail.com)\n` +
          `• **GitHub**: [github.com/Rahul-2148](https://github.com/Rahul-2148)`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: 'Chat reset! Ask me anything about Rahul’s projects, tech stack, or engineering philosophy.',
        timestamp: 'Just now',
      },
    ]);
  };

  // Hide completely on Admin pages or when resume preview modal is open
  if (isResumeModalOpen || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* ====================================================
          FLOATING LAUNCHER BUTTON (BOTTOM-RIGHT)
          ==================================================== */}
      <div 
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip Badge: Auto-visible for first 5s on land, smoothly hides, and expands on hover */}
        <AnimatePresence>
          {!isOpen && (showBadge || isHovered) && (
            <motion.div
              initial={{ opacity: 0, x: 14, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={() => setIsOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/90 backdrop-blur-md border border-purple-500/40 text-foreground text-[11px] font-mono shadow-xl hover:border-purple-400 cursor-pointer transition-all hover:scale-105 select-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-purple-400">Ask Rahul&apos;s AI</span>
              <span className="text-[10px] text-muted-foreground">✨</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Morphing Launcher Button — Sleek & Compact */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group cursor-pointer ${
            isOpen
              ? 'bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white hover:scale-110 active:scale-95 shadow-purple-500/30 ring-2 ring-purple-500/20'
          }`}
          data-cursor="AI"
          aria-label={isOpen ? 'Close AI Chat' : 'Open AI Chat'}
        >
          {/* Ambient Pulsing Aura */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 opacity-40 blur-md animate-pulse pointer-events-none" />
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ====================================================
          ANIMATED EXPANSIVE CHATBOT PANEL
          ==================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.16 }}
            data-lenis-prevent
            style={
              !isFullScreen
                ? isCustomPosition && position
                  ? {
                      top: `${position.y}px`,
                      left: `${position.x}px`,
                      width: `${size.width}px`,
                      height: `${size.height}px`,
                    }
                  : {
                      width: `min(${size.width}px, calc(100vw - 2rem))`,
                      height: `min(${size.height}px, calc(100dvh - 6.5rem))`,
                    }
                : undefined
            }
            className={`fixed z-50 bg-card/95 backdrop-blur-2xl border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10 overscroll-contain transition-[box-shadow,border-color] duration-150 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] ${
              isFullScreen
                ? 'inset-2 sm:inset-4 md:inset-6 w-auto h-auto rounded-2xl sm:rounded-3xl border-purple-500/40 ring-purple-500/20'
                : isCustomPosition && position
                ? 'rounded-3xl'
                : 'bottom-20 right-4 sm:right-6 rounded-3xl'
            } ${
              isDragging
                ? 'shadow-purple-500/30 ring-2 ring-purple-500/50 shadow-2xl select-none'
                : isResizing
                ? 'shadow-cyan-500/25 ring-2 ring-cyan-500/40 select-none'
                : ''
            }`}
          >
            {/* Header (Draggable & Double-click to Fullscreen) */}
            <div
              onPointerDown={handleDragStart}
              onDoubleClick={toggleFullScreen}
              className={`px-4 sm:px-5 py-3.5 bg-surface/90 border-b border-border/80 flex items-center justify-between shrink-0 select-none transition-colors ${
                isFullScreen ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Rahul AI Assistant
                  </h3>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span>Ask about projects &amp; engineering experience</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 text-muted-foreground">
                {/* Reset / Clear Chat */}
                <button
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Fullscreen / Restore Toggle */}
                <button
                  onClick={toggleFullScreen}
                  title={isFullScreen ? 'Exit full screen (Restore)' : 'Full screen'}
                  className="p-1.5 rounded-lg hover:text-purple-400 hover:bg-surface-elevated transition-colors cursor-pointer"
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Reset Window Size & Dock (visible when user moved or resized it) */}
                {isCustomized && (
                  <button
                    onClick={resetToDefault}
                    title="Reset to default size & dock position"
                    className="p-1.5 rounded-lg hover:text-cyan-400 hover:bg-surface-elevated transition-colors animate-fade-in cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Dedicated Close Button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsFullScreen(false);
                  }}
                  title="Close chat"
                  className="p-1.5 rounded-lg hover:text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages History Container */}
            <div
              ref={messagesContainerRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin overscroll-contain touch-pan-y"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                        : 'bg-surface/90 border border-border text-foreground rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <FormattedMessage content={msg.content} />
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      R
                    </div>
                  )}
                </div>
              ))}

              {/* Claude / ChatGPT Style Thinking Indicator */}
              {isThinking && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-surface/80 border border-border rounded-2xl rounded-tl-none px-4 py-2.5 text-xs font-mono text-purple-400 flex items-center gap-2 shadow-xs">
                    <span>Analyzing Rahul&apos;s codebase &amp; architecture...</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips (when user is at the start) */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-surface/50 border-t border-border/60">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1.5">
                  Suggested Questions:
                </span>
                <div
                  data-lenis-prevent
                  className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x overscroll-contain"
                >
                  {DEFAULT_SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      data-cursor="ASK"
                      className="group px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-[11px] font-mono text-muted-foreground hover:text-foreground hover:border-purple-500/50 hover:bg-surface-elevated/80 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>{sug}</span>
                      <ChevronRight className="w-3 h-3 text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input Box with Whisper-Flow Voice Search */}
            <div className="p-3.5 sm:p-4 bg-surface/95 border-t border-border shrink-0">
              {voiceError && (
                <div className="mb-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between animate-fade-in">
                  <span>{voiceError}</span>
                  <button onClick={() => setVoiceError(null)} className="text-red-400/80 hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isListening
                        ? 'Listening... speak now'
                        : 'Ask about projects, degree, or tech stack...'
                    }
                    disabled={isThinking}
                    className={`w-full bg-surface border rounded-xl pl-4 pr-11 py-2.5 text-xs sm:text-[13px] font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all disabled:opacity-50 ${
                      isListening
                        ? 'border-purple-500 ring-2 ring-purple-500/30 bg-purple-500/5'
                        : 'border-border'
                    }`}
                  />

                  {/* Whisper-Flow Style Microphone Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    title={isListening ? 'Stop listening' : 'Voice Search (Whisper mode)'}
                    className={`absolute right-2 p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                      isListening
                        ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40 shadow-sm'
                        : 'text-muted-foreground hover:text-purple-400 hover:bg-surface-elevated'
                    }`}
                  >
                    {isListening ? (
                      <div className="flex items-center gap-0.5 px-0.5">
                        <span className="w-0.5 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-0.5 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-0.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 disabled:opacity-30 text-white transition-all shadow-md shadow-purple-500/20 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Interactive Resizing Handles (Corners & Edges) */}
            {!isFullScreen && (
              <>
                {/* Corner Hit Areas */}
                <div
                  onPointerDown={(e) => handleResizeStart(e, 'nw')}
                  className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-30"
                  title="Drag to resize"
                />
                <div
                  onPointerDown={(e) => handleResizeStart(e, 'ne')}
                  className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize z-30"
                  title="Drag to resize"
                />
                <div
                  onPointerDown={(e) => handleResizeStart(e, 'sw')}
                  className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-30"
                  title="Drag to resize"
                />
                <div
                  onPointerDown={(e) => handleResizeStart(e, 'se')}
                  className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-30"
                  title="Drag to resize"
                />

                {/* Edge Hit Areas */}
                <div
                  onPointerDown={(e) => handleResizeStart(e, 'n')}
                  className="absolute top-0 left-4 right-4 h-1.5 cursor-ns-resize z-20"
                />
                <div
                  onPointerDown={(e) => handleResizeStart(e, 's')}
                  className="absolute bottom-0 left-4 right-4 h-1.5 cursor-ns-resize z-20"
                />
                <div
                  onPointerDown={(e) => handleResizeStart(e, 'w')}
                  className="absolute top-4 bottom-4 left-0 w-1.5 cursor-ew-resize z-20"
                />
                <div
                  onPointerDown={(e) => handleResizeStart(e, 'e')}
                  className="absolute top-4 bottom-4 right-0 w-1.5 cursor-ew-resize z-20"
                />

                {/* Visible Bottom-Right Resize Grip Indicator */}
                <div
                  onPointerDown={(e) => handleResizeStart(e, 'se')}
                  onDoubleClick={resetToDefault}
                  title="Drag corner to resize • Double-click to reset default size"
                  className="absolute bottom-1 right-1 w-4 h-4 flex items-end justify-end cursor-nwse-resize z-20 text-muted-foreground/30 hover:text-purple-400 transition-colors pointer-events-auto"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-current">
                    <path d="M8.5 1.5L1.5 8.5M8.5 5L5 8.5M8.5 7.5L7.5 8.5" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AiChatWidget;
