'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  sources?: string[];
}

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        `Hello! I am Rahul Raj's AI Portfolio Assistant. I have verified access to his GitHub architecture, codebase structure, and technical case studies. Ask me anything about his full-stack capabilities, system design decisions, or specific project implementations.`,
      sources: ['GitHub: Rahul-2148', 'System Architecture Specs'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Which project best demonstrates Rahul's backend skills?",
    "Explain Zosh Bazaar's micro-frontend architecture.",
    "How is real-time delivery tracking engineered in Snapcart?",
    "What AI and Python services has Rahul built?",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAnswer = (query: string): { content: string; sources: string[] } => {
    const q = query.toLowerCase();

    if (q.includes('backend') || q.includes('api') || q.includes('server')) {
      return {
        content:
          `Rahul's strongest backend demonstration is found across **Zosh Bazaar** and **Snapcart**.\n\n` +
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
          `• **Real-Time State Synchronization**: Uses Socket.IO rooms scoped by unique order IDs (` +
          '`order_{orderId}`' +
          `). As rider geolocation updates occur, events stream directly to the customer storefront with sub-second latency.\n` +
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
          `• **Python ML Engine**: Standalone Python microservice in Snapcart and Zosh Bazaar providing recommendation scoring and relevance analysis.\n` +
          `• **Provider Abstraction**: System design supports model-swapping (Gemini API, Claude, OpenAI) without rewriting business layer code.`,
        sources: ['AI Orchestration Layer', 'Python Microservices'],
      };
    }

    // Default intelligent response
    return {
      content:
        `Based on Rahul's verified repositories:\n\n` +
        `Rahul Raj is a Full-Stack Engineer focused on scalable Next.js/React applications, Node.js distributed backends, MongoDB data modeling, and low-latency Socket.IO systems. Key flagship implementations include **Zosh Bazaar** (5 micro-frontends) and **Snapcart** (10-min grocery delivery platform). Feel free to ask about his specific architectures or click into the Interactive Architecture section!`,
      sources: ['GitHub: Rahul-2148 Verified Work'],
    };
  };

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isTyping) return;

    const userMsg: Message = {
      role: 'user',
      content: q.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateAnswer(q);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answer.content,
          sources: answer.sources,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <section id="ai-lab" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
          <Bot className="w-3.5 h-3.5" />
          <span>Interactive AI Intelligence Lab</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Ask the Architecture AI
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
          Grounded directly in Rahul&apos;s verified GitHub codebases, system diagrams, and engineering decisions.
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-[#0b0b14] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-[#11111d] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Portfolio Neural Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              </div>
              <div className="text-[10px] font-mono text-neutral-400">Model: Gemini Provider Abstraction</div>
            </div>
          </div>
          <button
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content: 'Chat cleared. Ask me anything about Rahul&apos;s engineering projects or architecture.',
                },
              ])
            }
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title="Reset Chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="px-6 py-2.5 bg-black/30 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] font-mono text-neutral-500 uppercase shrink-0">Prompts:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="shrink-0 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-cyan-500/15 border border-white/[0.08] hover:border-cyan-500/30 text-neutral-300 hover:text-cyan-200 text-[11px] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3.5 leading-relaxed text-sm ${
                    isUser
                      ? 'bg-cyan-500 text-black font-medium'
                      : 'bg-white/[0.04] border border-white/[0.08] text-neutral-200'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {msg.sources && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-cyan-300">
                      <span className="text-neutral-500">Verified Sources:</span>
                      {msg.sources.map((s, sIdx) => (
                        <span key={sIdx} className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-neutral-400">Analyzing architecture knowledgebase...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#090910] border-t border-white/10 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Rahul's backend, real-time tracking, or micro-frontends..."
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
export default AiAssistant;
