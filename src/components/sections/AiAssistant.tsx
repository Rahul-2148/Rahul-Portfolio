'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, RefreshCw, ChevronRight } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        `👋 Hi! I'm Rahul's AI Assistant. Ask me anything about his projects, architecture, or tech stack — or choose a question below.`,
      sources: ['GitHub: Rahul-2148', 'Architecture Specs'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const suggestedQuestions = [
    "🏪 Multi-Vendor vs Single-Vendor e-commerce?",
    "🚀 Explain Zosh Bazaar's micro-frontend architecture",
    "⚡ How does Snapcart handle real-time delivery tracking?",
    "🛠️ What is Rahul's core backend & tech stack?",
  ];

  // Self-contained smooth auto-scroll inside the feed container only (never jumps the browser page)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: feedRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  const generateAnswer = (query: string): { content: string; sources: string[] } => {
    const q = query.toLowerCase();

    if (
      q.includes('difference') ||
      q.includes('multivendor') ||
      q.includes('multi-vendor') ||
      q.includes('single-vendor') ||
      q.includes('singlevendor') ||
      q.includes('vendor') ||
      q.includes('ecommerce') ||
      q.includes('e-commerce')
    ) {
      return {
        content:
          `Rahul has built **4 distinct e-commerce architectures**:\n\n` +
          `• 🏪 **Zosh Bazaar (Multi-Vendor B2B2C)**: 5 decoupled micro-frontends with Client, Merchant, Platform Admin, Logistics, and Delivery Rider OTP portals for multi-tenant vendor onboarding.\n` +
          `• 🛍️ **ClassyShop (Single-Vendor D2C)**: Direct brand store with Customer Storefront + Owner Admin Panel (no 3rd-party vendors) and automated invoice export.\n` +
          `• ⚡ **Snapcart (Quick-Commerce)**: 10-minute grocery delivery with localized dark stores, Socket.IO live GPS rider tracking, and Redis caching.\n` +
          `• 🍕 **ZaykaHub (Food Delivery)**: Restaurant-to-customer food ordering with kitchen queue dispatch and dual payment checkout.`,
        sources: ['Zosh-Bazaar Multi-Vendor', 'ClassyShop D2C Specs', 'Snapcart Specs'],
      };
    }

    if (q.includes('backend') || q.includes('api') || q.includes('server')) {
      return {
        content:
          `Rahul's strongest backend demonstration is found across **Zosh Bazaar** and **Snapcart**:\n\n` +
          `• **Zosh Bazaar Gateway Server**: An Express + Socket.IO hub coordinating 5 micro-frontends with JWT-based role-based access control (RBAC), multi-role authentication, dynamic CORS, and Razorpay webhook cryptographic verification.\n` +
          `• **Snapcart**: Implements dual payment gateway orchestration (Stripe + Razorpay) with abstracted provider interfaces, Redis caching for fast session and inventory reads, and event-driven order state machines.`,
        sources: ['Zosh-Bazaar-Multivendor-Ecommerce', 'Snapcart Gateway Specs'],
      };
    }

    if (q.includes('zosh') || q.includes('micro-frontend') || q.includes('bazaar')) {
      return {
        content:
          `**Zosh Bazaar** is an enterprise-level multi-vendor ecosystem engineered with **5 decoupled micro-frontends**:\n\n` +
          `1. **Customer Storefront**: Product discovery, cart, checkout, AI assistant.\n` +
          `2. **Merchant Console**: Inventory management, order fulfillment, media asset pipeline.\n` +
          `3. **Platform Admin**: Vendor KYC audits, commission policies, category governance.\n` +
          `4. **Logistics Control Tower**: Automated hub dispatch & real-time driver routing.\n` +
          `5. **Delivery Partner App**: Active queue, OTP verification handshake, contactless proof.\n\n` +
          `All 5 portals communicate with a central Node/Express gateway using Socket.IO rooms for zero-polling real-time updates.`,
        sources: ['Zosh-Bazaar Micro-Frontends', 'MongoDB Atlas Architecture'],
      };
    }

    if (q.includes('snapcart') || q.includes('real-time') || q.includes('tracking') || q.includes('delivery')) {
      return {
        content:
          `In **Snapcart** (10-minute grocery delivery platform):\n\n` +
          `• **Real-Time State Synchronization**: Uses Socket.IO rooms scoped by unique order IDs (\`order_{orderId}\`). As rider geolocation updates occur, events stream directly to the customer storefront with sub-second latency.\n` +
          `• **Caching & Performance**: Redis caches high-frequency product inventory and sessions to prevent read bottlenecking on MongoDB.\n` +
          `• **Dual Payments**: Custom payment provider layer routes between Stripe (international) and Razorpay (domestic) with automated status webhooks.`,
        sources: ['Snapcart Repository', 'Socket.IO Room Architecture'],
      };
    }

    if (q.includes('ai') || q.includes('python') || q.includes('ml')) {
      return {
        content:
          `Rahul integrates AI as functional product utilities rather than decorative gimmicks:\n\n` +
          `• **AI Shopping Assistant**: Integrated conversational assistant in Zosh Bazaar for conversational product discovery and natural language filtering.\n` +
          `• **Python ML Engine**: Standalone Python microservice in Snapcart providing recommendation scoring and relevance analysis.\n` +
          `• **Provider Abstraction**: System design supports resilient multi-model orchestration with automatic fallback pipelines without rewriting business layer code.`,
        sources: ['AI Orchestration Layer', 'Python Microservices'],
      };
    }

    return {
      content:
        `Rahul Raj is a Full-Stack Engineer specializing in scalable Next.js/React applications, Node.js distributed backends, MongoDB, and low-latency Socket.IO systems. Key flagship implementations include **Zosh Bazaar** (5 micro-frontends) and **Snapcart** (10-min grocery delivery). Ask me anything specific or check out the architecture visualizer above!`,
      sources: ['GitHub: Rahul-2148'],
    };
  };

  const getSourcesForQuery = (query: string): string[] => {
    const q = query.toLowerCase();
    if (q.includes('zosh') || q.includes('bazaar') || q.includes('vendor')) {
      return ['Zosh-Bazaar Repository', 'Socket.IO Architecture', 'Verified GitHub Work'];
    }
    if (q.includes('snapcart') || q.includes('grocery') || q.includes('redis') || q.includes('tracking')) {
      return ['Snapcart Core Specs', 'Redis Caching & Pub/Sub', 'Dual Gateway System'];
    }
    if (q.includes('classy') || q.includes('e-commerce') || q.includes('ecommerce')) {
      return ['ClassyShop Architecture', 'React 19 & Express 5', 'Verified Codebase'];
    }
    if (q.includes('vybe') || q.includes('social') || q.includes('instagram')) {
      return ['VYBE Social Platform', 'Cloudinary Asset Pipeline'];
    }
    if (q.includes('backend') || q.includes('server') || q.includes('api')) {
      return ['Node.js & Express Architecture', 'MongoDB Schema Specs'];
    }
    if (q.includes('realtime') || q.includes('real-time') || q.includes('socket')) {
      return ['Socket.IO Scoped Rooms', 'Redis Pub/Sub Specifications'];
    }
    if (q.includes('education') || q.includes('degree') || q.includes('college')) {
      return ['Academic Credentials', 'Verified Portfolio Data'];
    }
    if (q.includes('resume') || q.includes('cv') || q.includes('experience')) {
      return ['Executive Curriculum Vitae', 'Engineering Milestones'];
    }
    return ['GitHub: Rahul-2148', 'System Architecture Specs'];
  };

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || isTyping) return;

    const userMessage: Message = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.content || generateAnswer(q).content;
        const sources = getSourcesForQuery(q);

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content,
            sources,
          },
        ]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      const ans = generateAnswer(q);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: ans.content,
          sources: ans.sources,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="ai-lab" className="pt-4 sm:pt-6 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 sm:pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-border-accent shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span>AI Portfolio Assistant</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Online
                </span>
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Grounded in verified GitHub repositories &amp; system architecture
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content:
                    'Context reset. Ask me anything about Rahul Raj’s projects, tech stack, or distributed architectures.',
                  sources: ['GitHub: Rahul-2148'],
                },
              ])
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-xs text-muted-foreground hover:text-foreground transition-all self-start sm:self-auto cursor-pointer"
            data-cursor="RESET"
            title="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Suggested Question Chips */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
            Suggested Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isTyping}
                data-cursor="ASK"
                className="group inline-flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-foreground hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-300 transition-all shadow-xs disabled:opacity-50 text-left cursor-pointer active:scale-95"
              >
                <span>{q}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Messages Feed */}
        <div
          ref={feedRef}
          className="space-y-4 max-h-[420px] overflow-y-auto pr-2"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-sm leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-border-accent mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl space-y-2 shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-surface border border-border text-foreground'
                }`}
              >
                <div className="whitespace-pre-line text-xs sm:text-sm">{msg.content}</div>

                {msg.sources && (
                  <div className="pt-2 border-t border-border/40 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                    <span>Sources:</span>
                    {msg.sources.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-foreground font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-surface border border-border text-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-muted-foreground font-mono pl-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>Analyzing repositories &amp; synthesizing answer...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 bg-surface p-2 rounded-2xl border border-border focus-within:border-border-accent transition-all shadow-xs">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Zosh Bazaar, Snapcart, Redis caching, or Socket.IO..."
            disabled={isTyping}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            data-cursor="SEND"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default AiAssistant;
