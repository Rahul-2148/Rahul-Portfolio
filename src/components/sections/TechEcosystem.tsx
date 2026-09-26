'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  ExternalLink,
  Layers,
  CheckCircle2,
  Cpu,
  Zap,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { skills, projects } from '@/lib/data/portfolio';
import { TechIcon } from '@/components/ui/TechIcons';

/* =========================================================================
   AUTHENTIC BRAND COLOR & REAL-WORLD ARCHITECTURAL HIGHLIGHTS
   ========================================================================= */
export interface TechMeta {
  color: string;
  glow: string;
  techType?: string;
  experienceLevel?: 'Core Stack' | 'Production Stack' | 'Proficient';
  role: string;
  tagline: string;
  highlights: string[];
}

/**
 * Returns a concise, standardized technical classification badge label (e.g. Framework, UI Library, Language, Database)
 */
export function getShortType(name: string, category?: string): string {
  const norm = name.trim().toLowerCase();

  // Frameworks
  if (norm === 'next.js' || norm === 'nextjs') return 'Framework';
  if (norm === 'express' || norm === 'express.js') return 'Framework';
  if (norm === 'fastapi' || norm === 'django' || norm === 'flask') return 'Framework';

  // UI Libraries
  if (norm === 'react') return 'UI Library';
  if (norm.includes('material') || norm.includes('mui')) return 'UI Library';
  if (norm.includes('shadcn')) return 'UI Library';
  if (norm.includes('redux') || norm.includes('zustand')) return 'State Library';
  if (norm.includes('mongoose')) return 'ODM Library';

  // CSS Frameworks
  if (norm.includes('tailwind') || norm.includes('bootstrap')) return 'CSS Framework';

  // Programming / Scripting Languages
  if (norm === 'typescript' || norm === 'ts') return 'Language';
  if (norm === 'javascript' || norm === 'js') return 'Language';
  if (norm === 'python') return 'Language';
  if (norm === 'c++' || norm === 'cpp') return 'Language';

  // Runtime
  if (norm.includes('node')) return 'Runtime';

  // Databases & Storage
  if (norm.includes('mongo')) return 'Database';
  if (norm.includes('postgres') || norm.includes('sql')) return 'Database';
  if (norm.includes('redis')) return 'In-Memory DB';

  // Realtime & Networking Protocols
  if (norm.includes('socket')) return 'Realtime';
  if (norm.includes('webrtc')) return 'P2P Protocol';
  if (norm.includes('jwt')) return 'Auth Protocol';

  // Cloud & DevOps
  if (norm.includes('docker')) return 'DevOps';
  if (norm === 'git') return 'Version Control';
  if (norm.includes('github')) return 'CI/CD & Cloud';
  if (norm.includes('aws') || norm.includes('azure') || norm.includes('vercel')) return 'Cloud Platform';
  if (norm.includes('cloudinary')) return 'Media CDN';

  // AI & Machine Learning & Agentic Coding
  if (norm.includes('antigravity') || norm === 'agy') return 'Agentic IDE';
  if (norm.includes('windsurf')) return 'Agentic IDE';
  if (norm.includes('devin')) return 'AI Engineer';
  if (norm.includes('claude') || norm.includes('gemini') || norm.includes('deepseek') || norm.includes('grok')) return 'AI Model';
  if (norm.includes('groq')) return 'AI Hardware';
  if (norm.includes('python ml') || norm.includes('ml')) return 'Machine Learning';

  // Tools & Security
  if (norm.includes('razorpay') || norm.includes('stripe')) return 'Payment API';
  if (norm.includes('vs code') || norm.includes('vscode')) return 'Developer IDE';
  if (norm.includes('vite')) return 'Build Tool';
  if (norm.includes('ui/ux') || norm.includes('figma')) return 'Design System';

  // Non-IT: Flipkart CRM, Operations, Analytics, Media
  if (norm.includes('flipkart') || norm.includes('crm') || norm.includes('smart assist')) return 'CRM Software';
  if (norm.includes('excel')) return 'Analytics Tool';
  if (norm.includes('power bi') || norm.includes('powerbi')) return 'BI Dashboard';
  if (norm.includes('office') || norm.includes('word') || norm.includes('powerpoint')) return 'Office Suite';
  if (norm.includes('video') || norm.includes('editing')) return 'Creative Media';
  if (norm.includes('supply chain') || norm.includes('logistics')) return 'Supply Chain';
  if (norm.includes('six sigma') || norm.includes('quality')) return 'Quality Assurance';
  if (norm.includes('bpo') || norm.includes('customer')) return 'BPO Operations';
  if (norm.includes('leadership') || norm.includes('team')) return 'Leadership';
  if (norm.includes('optimization') || norm.includes('process')) return 'Operations';

  return category || 'Tool';
}

/**
 * Returns a comprehensive, descriptive technical classification label
 */
export function getTechType(name: string, category?: string): string {
  const meta = techMetadata[name];
  if (meta?.techType) return meta.techType;

  const norm = name.trim().toLowerCase();
  if (norm === 'next.js' || norm === 'nextjs') return 'Full-Stack Web Framework';
  if (norm === 'express' || norm === 'express.js') return 'Backend REST Framework';
  if (norm === 'fastapi') return 'High-Performance Async Python Framework';
  if (norm === 'django') return 'Full-Stack Python Framework';
  if (norm === 'flask') return 'Lightweight WSGI Python Micro-Framework';
  if (norm === 'react') return 'Frontend UI Architecture Library';
  if (norm.includes('material') || norm.includes('mui')) return 'Enterprise UI Component Library';
  if (norm.includes('shadcn')) return 'Accessible Headless UI Primitives';
  if (norm.includes('tailwind')) return 'Utility-First CSS Framework';
  if (norm.includes('bootstrap')) return 'Responsive Grid & CSS Framework';
  if (norm === 'typescript') return 'Statically Typed Programming Language';
  if (norm === 'javascript') return 'Dynamic Web Scripting Language';
  if (norm === 'python') return 'High-Level Programming Language';
  if (norm === 'c++' || norm === 'cpp') return 'High-Performance Systems & DSA Language';
  if (norm.includes('node')) return 'Event-Driven Server Runtime';
  if (norm.includes('mongo')) return 'Document NoSQL Database';
  if (norm.includes('postgres')) return 'Relational SQL Database';
  if (norm.includes('redis')) return 'In-Memory Key-Value Data Store';
  if (norm.includes('mongoose')) return 'Object Data Modeling (ODM) Library';
  if (norm.includes('redux') || norm.includes('zustand')) return 'State Management Library';
  if (norm.includes('docker')) return 'Containerization Engine';
  if (norm === 'git') return 'Distributed Version Control System';
  if (norm.includes('github')) return 'DevOps & CI/CD Cloud Platform';
  if (norm.includes('aws') || norm.includes('azure') || norm.includes('vercel')) return 'Cloud Infrastructure & Hosting';
  if (norm.includes('antigravity') || norm === 'agy') return 'Autonomous Agentic IDE & Coding Assistant';
  if (norm.includes('windsurf')) return 'Agentic AI IDE & Codebase Intelligence';
  if (norm.includes('devin')) return 'Autonomous AI Software Engineer & Workflow Runner';
  if (norm.includes('claude') || norm.includes('gemini') || norm.includes('deepseek') || norm.includes('grok')) return 'Frontier AI Reasoning Model';
  if (norm.includes('groq')) return 'LPU Hardware Inference Engine';
  if (norm.includes('flipkart') || norm.includes('smart assist')) return 'E-Commerce Incident CRM Platform';
  if (norm.includes('excel')) return 'Data Modeling & MIS Spreadsheet Tool';
  if (norm.includes('power bi')) return 'Business Intelligence & Dashboard Tool';
  if (norm.includes('video')) return 'Creative Media & Post-Production';
  if (norm.includes('ui/ux')) return 'UI/UX Design & Prototyping System';

  return getShortType(name, category);
}

const techMetadata: Record<string, TechMeta> = {
  'Next.js': {
    color: '#E2E8F0',
    glow: 'rgba(255, 255, 255, 0.35)',
    experienceLevel: 'Core Stack',
    role: 'Primary Full-Stack Web Framework',
    tagline: 'App Router, SSR, SSG, Server Actions & Edge Middleware',
    highlights: [
      'App Router & Hybrid SSR/SSG rendering pipelines',
      'Server Actions & REST route handlers for backend logic',
      'Edge Middleware for secure authentication guards',
      'Dynamic SEO metadata generation and static optimization',
    ],
  },
  'React': {
    color: '#61DAFB',
    glow: 'rgba(97, 218, 251, 0.4)',
    experienceLevel: 'Core Stack',
    role: 'Frontend UI Architecture Engine',
    tagline: 'Component State, Custom Hooks, Context & Modern Virtual DOM',
    highlights: [
      'Custom Hooks & modular component hierarchies',
      'Context API & centralized reactive state flows',
      'Optimistic UI updates for high-speed responsiveness',
      'Vite & Next.js micro-frontend integration',
    ],
  },
  'TypeScript': {
    color: '#3178C6',
    glow: 'rgba(49, 120, 198, 0.4)',
    experienceLevel: 'Core Stack',
    role: 'End-to-End Type Safety',
    tagline: 'Strict Types, Generics, Interfaces & Discriminated Unions',
    highlights: [
      'Strict type contracts shared across frontend and APIs',
      'Generic interfaces, utility types, and discriminated unions',
      'Compile-time bug prevention and autocompletion',
      'Zero runtime overhead architecture',
    ],
  },
  'JavaScript': {
    color: '#F7DF1E',
    glow: 'rgba(247, 223, 30, 0.4)',
    experienceLevel: 'Core Stack',
    role: 'Web Runtime Core',
    tagline: 'Modern ESNext, Asynchronous Event Loop, DOM APIs',
    highlights: [
      'Modern ES6+ syntax, closures, and prototypical patterns',
      'Async/Await event loop orchestration for non-blocking I/O',
      'Client-side DOM manipulation and event delegation',
      'Cross-browser optimization & performance profiling',
    ],
  },
  'Vite': {
    color: '#BD34FE',
    glow: 'rgba(189, 52, 254, 0.45)',
    experienceLevel: 'Production Stack',
    role: 'High-Performance Micro-Frontend Bundler',
    tagline: 'Instant Hot Module Replacement & Optimized Rollup Builds',
    highlights: [
      'Sub-second Hot Module Replacement (HMR) during development',
      'Optimized Rollup production bundling with tree-shaking',
      'Powers multiple portals in Zosh Bazaar and ZaykaHub',
      'Zero-configuration TypeScript & Tailwind compilation',
    ],
  },
  'Tailwind CSS': {
    color: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.4)',
    experienceLevel: 'Core Stack',
    role: 'Dynamic Design System & Layouts',
    tagline: 'Utility-First Responsive Styling, Custom Tokens & Animations',
    highlights: [
      'Custom design token systems, dark/light theme variables',
      'Fully responsive mobile-first layouts without style bloat',
      'Micro-animations, smooth transitions, and glassmorphism',
      'Zero runtime CSS overhead with JIT compiler',
    ],
  },
  'Redux Toolkit': {
    color: '#764ABC',
    glow: 'rgba(118, 74, 188, 0.4)',
    experienceLevel: 'Proficient',
    role: 'Predictable Global State Store',
    tagline: 'Slice Architecture, RTK Query Auto-Caching & Middleware',
    highlights: [
      'Predictable immutable state slices and action creators',
      'RTK Query automated caching and background revalidation',
      'Centralized shopping cart and order checkout state',
    ],
  },
  'Zustand': {
    color: '#E8B898',
    glow: 'rgba(232, 184, 152, 0.4)',
    experienceLevel: 'Production Stack',
    role: 'Lightweight Reactive Store',
    tagline: 'Atomic State Management with Zero Boilerplate & Persistence',
    highlights: [
      'Atomic state management with zero boilerplate overhead',
      'Local storage persistence for food carts and user preferences',
      'Selective component re-rendering for peak performance',
    ],
  },
  'shadcn/ui': {
    color: '#E2E8F0',
    glow: 'rgba(255, 255, 255, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Accessible Headless Component Primitives',
    tagline: 'Radix UI Accessibility, Tailwind CSS Styling, Copy-Paste Architecture & Theme Variables',
    highlights: [
      'Accessible, unstyled Radix UI primitives with full keyboard navigation and screen reader support (WAI-ARIA)',
      'Direct code ownership with Tailwind CSS utility classes and zero npm dependency bloat',
      'Dynamic light/dark theme variables, dialogs, popovers, command palettes, and data tables',
      'Powers the modern design systems across SnapCart and Zosh Bazaar',
    ],
  },
  'shadcn ui': {
    color: '#E2E8F0',
    glow: 'rgba(255, 255, 255, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Accessible Headless Component Primitives',
    tagline: 'Radix UI Accessibility, Tailwind CSS Styling, Copy-Paste Architecture & Theme Variables',
    highlights: [
      'Accessible, unstyled Radix UI primitives with full keyboard navigation and screen reader support (WAI-ARIA)',
      'Direct code ownership with Tailwind CSS utility classes and zero npm dependency bloat',
      'Dynamic light/dark theme variables, dialogs, popovers, command palettes, and data tables',
      'Powers the modern design systems across SnapCart and Zosh Bazaar',
    ],
  },
  'Material UI': {
    color: '#007FFF',
    glow: 'rgba(0, 127, 255, 0.45)',
    experienceLevel: 'Proficient',
    role: 'Enterprise Material Design Component Library',
    tagline: 'Google Material Guidelines, Emotion Styled-Engine, Data Grids & Palette Theming',
    highlights: [
      'Pre-built Material Design 3 components with comprehensive accessibility and elevation layers',
      'Custom theme creation with color palettes, typography scales, and responsive breakpoints',
      'Complex enterprise data tables, date pickers, drawer menus, and modal dialogs',
      'Seamless integration with Emotion and CSS-in-JS style engines',
    ],
  },
  'Bootstrap': {
    color: '#7952B3',
    glow: 'rgba(121, 82, 179, 0.45)',
    experienceLevel: 'Proficient',
    role: 'Responsive Flexbox & Grid Framework',
    tagline: '12-Column Responsive Grid, Utility Classes, Navbars & Cross-Browser UI Components',
    highlights: [
      '12-column responsive flexbox grid system with mobile-first breakpoint utilities',
      'Rapid UI prototyping with prebuilt cards, modals, carousels, and dropdown components',
      'Custom SCSS variable overrides for branded colors and typography hierarchies',
      'Cross-browser normalized styling and responsive layout stability',
    ],
  },
  'Node.js': {
    color: '#5FA04E',
    glow: 'rgba(95, 160, 78, 0.4)',
    experienceLevel: 'Core Stack',
    role: 'Event-Driven Server Runtime',
    tagline: 'Non-Blocking Async I/O, REST APIs, Streaming & Microservices',
    highlights: [
      'High-throughput asynchronous I/O and RESTful API endpoints',
      'Background worker jobs and scheduled queue processing',
      'Integration with Socket.IO servers for live GPS tracking',
      'Scalable microservice gateways with modular route clusters',
    ],
  },
  'Express': {
    color: '#E2E8F0',
    glow: 'rgba(226, 232, 240, 0.3)',
    experienceLevel: 'Core Stack',
    role: 'REST API & Middleware Gateway',
    tagline: 'RESTful Routing Pipelines, RBAC Security, Error Handlers',
    highlights: [
      'Role-based authorization middleware (RBAC) across 5 portals',
      'Dynamic CORS policies, rate limiting, and centralized error catching',
      'Webhook receivers with HMAC verification for Stripe & Razorpay',
      'REST controller architecture with clean separation of concerns',
    ],
  },
  'Python': {
    color: '#3776AB',
    glow: 'rgba(55, 118, 171, 0.4)',
    experienceLevel: 'Proficient',
    role: 'ML Services & Algorithmic Backend',
    tagline: 'Data Processing, Recommendation Algorithms, Microservices',
    highlights: [
      'Collaborative and content-based recommendation logic',
      'Data transformation, user preference vectors, and similarity scoring',
      'Standalone microservice integration with Node.js gateways',
    ],
  },
  'FastAPI': {
    color: '#009688',
    glow: 'rgba(0, 150, 136, 0.4)',
    experienceLevel: 'Proficient',
    role: 'High-Throughput Async Python API',
    tagline: 'Pydantic Model Validation, Automatic OpenAPI Docs, Async Endpoints',
    highlights: [
      'Asynchronous endpoint serving for product recommendation requests',
      'Strict Pydantic payload serialization and validation',
      'Automatic OpenAPI interactive API documentation',
    ],
  },
  'Django': {
    color: '#44B78B',
    glow: 'rgba(68, 183, 139, 0.4)',
    experienceLevel: 'Proficient',
    role: 'Robust MVT Backend Architecture',
    tagline: 'ORM Data Modeling, Admin Dashboard, WebSockets Channels',
    highlights: [
      'ORM data models with relational schema constraints',
      'Django Channels integration for real-time WebSocket chat',
      'Built-in session authentication and user security',
    ],
  },
  'C++': {
    color: '#00599C',
    glow: 'rgba(0, 89, 156, 0.45)',
    techType: 'Language',
    experienceLevel: 'Core Stack',
    role: 'Low-Level Systems & Algorithmic Core',
    tagline: 'Object-Oriented Architecture, Standard Template Library (STL), Memory Management & Performance Algorithms',
    highlights: [
      'Standard Template Library (STL) algorithms, vectors, maps, and memory optimization',
      'Object-oriented design patterns, RAII, pointers, and memory reference management',
      'Complex algorithmic problem solving, time-complexity analysis, and data structures',
      'High-throughput computational routines and system performance optimization',
    ],
  },
  'Flask': {
    color: '#E2E8F0',
    glow: 'rgba(255, 255, 255, 0.4)',
    techType: 'Framework',
    experienceLevel: 'Proficient',
    role: 'Lightweight Python Microservice Framework',
    tagline: 'Modular WSGI Routing, Python Blueprints, REST APIs & Jinja2 Templating',
    highlights: [
      'Lightweight microservices and RESTful API endpoints with minimal overhead',
      'Modular Blueprints architecture for scalable route structuring',
      'Integration with SQLAlchemy ORM, WTForms, and Python ML pipelines',
      'Flexible WSGI server deployment with Gunicorn and Nginx',
    ],
  },
  'MongoDB': {
    color: '#47A248',
    glow: 'rgba(71, 162, 72, 0.4)',
    experienceLevel: 'Core Stack',
    role: 'Primary Document Database',
    tagline: 'Complex Aggregation Pipelines, Indexed Queries, Atlas Clusters',
    highlights: [
      'Multi-stage aggregation pipelines ($match, $lookup, $group, $sort)',
      'Compound indexing for sub-15ms multi-tenant queries',
      'MongoDB Atlas cloud replica sets with automatic scaling',
      'Denormalized e-commerce catalogs with nested variations',
    ],
  },
  'Mongoose': {
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.4)',
    experienceLevel: 'Core Stack',
    role: 'Object Data Modeling Layer',
    tagline: 'Schema Validation, Pre/Post Hooks, Virtuals & Population',
    highlights: [
      'Strict schema validation and type coercion rules',
      'Pre-save and post-query middleware hooks for automated auditing',
      'Virtual population and foreign-key referencing across collections',
    ],
  },
  'PostgreSQL': {
    color: '#336791',
    glow: 'rgba(51, 103, 145, 0.4)',
    experienceLevel: 'Proficient',
    role: 'Relational ACID Data Store',
    tagline: 'Structured Relational Schemas, Complex SQL Queries, Transactions & Indexing',
    highlights: [
      'Relational schema modeling with foreign keys, checks, and constraints',
      'ACID transactions and multi-table JOIN query optimization',
      'B-tree indexing and query execution planning',
      'Integration with Node.js via pg and ORM migration layers',
    ],
  },
  'Redis': {
    color: '#DC382D',
    glow: 'rgba(220, 56, 45, 0.45)',
    experienceLevel: 'Production Stack',
    role: 'In-Memory Cache & Pub/Sub Hub',
    tagline: 'Sub-Millisecond Query Cache, Session Storage, Rate Limiting',
    highlights: [
      'Sub-millisecond query caching for heavy product searches',
      'IP-based and user-based API rate limiting to thwart abuse',
      'Pub/Sub message broker for distributed Socket.IO horizontal scaling',
    ],
  },
  'Socket.IO': {
    color: '#00D4FF',
    glow: 'rgba(0, 212, 255, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Bi-Directional Real-Time Engine',
    tagline: 'Multi-Room Broadcasting, Live Driver GPS Tracking, Event Bus',
    highlights: [
      'Dynamic order-scoped WebSocket rooms for private delivery channels',
      'Real-time GPS coordinate streaming from driver app to customer map',
      'Instant notifications for order approval, dispatch, and OTP delivery',
      'Automatic heartbeat reconnection and fallback polling',
    ],
  },
  'WebRTC': {
    color: '#4D96FF',
    glow: 'rgba(77, 150, 255, 0.4)',
    experienceLevel: 'Proficient',
    role: 'Peer-to-Peer Communication',
    tagline: 'Direct Audio/Video Streams, Screen Share, STUN/TURN Signaling',
    highlights: [
      'Peer-to-peer low-latency video and audio stream connections',
      'Socket.IO signaling for ICE candidate exchange and SDP handshakes',
      'Screen sharing streams for collaborative video calls',
    ],
  },
  'AWS': {
    color: '#FF9900',
    glow: 'rgba(255, 153, 0, 0.45)',
    experienceLevel: 'Proficient',
    role: 'Cloud Infrastructure & Services',
    tagline: 'Amazon S3 Object Storage, EC2 Compute, IAM Security & Cloud Architecture',
    highlights: [
      'Amazon S3 bucket policies, presigned URLs, and object storage',
      'EC2 virtual compute instance configuration and Linux hosting',
      'IAM roles, security groups, and API access management',
      'CloudFront global CDN distribution fundamentals',
    ],
  },
  'Microsoft Azure': {
    color: '#0078D4',
    glow: 'rgba(0, 120, 212, 0.45)',
    experienceLevel: 'Proficient',
    role: 'Cloud Infrastructure & Enterprise Services',
    tagline: 'Azure App Services, Blob Storage, Virtual Machines, Azure DevOps & Entra ID',
    highlights: [
      'Azure App Service deployment and containerized cloud workloads',
      'Azure Blob Storage for secure, scalable unstructured asset storage',
      'Virtual Machines (IaaS) provisioning, network security groups and Linux administration',
      'Microsoft Entra ID (Azure AD) enterprise identity, SSO and RBAC configuration',
    ],
  },
  'Vercel': {
    color: '#E2E8F0',
    glow: 'rgba(255, 255, 255, 0.35)',
    experienceLevel: 'Core Stack',
    role: 'Edge Deployment Platform',
    tagline: 'CI/CD Pipelines, Serverless Functions, Edge Middleware & DNS',
    highlights: [
      'Automated Git-triggered preview and production deployment pipelines',
      'Global Edge Network caching with sub-30ms international load times',
      'Serverless API routes with auto-scaling execution',
      'Custom domain DNS management and SSL provisioning',
    ],
  },
  'Cloudinary': {
    color: '#3448C5',
    glow: 'rgba(52, 72, 197, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Dynamic Media Pipeline & CDN',
    tagline: 'On-the-Fly Image Resize, Video Transcoding & WebP Delivery',
    highlights: [
      'Dynamic project folder organization (portfolio/projects/slug)',
      'Automated WebP and AVIF next-gen format conversion',
      'Real-time single and bulk asset deletion API integration',
      'Multi-image gallery uploads with CDN delivery',
    ],
  },
  'Docker': {
    color: '#2496ED',
    glow: 'rgba(36, 150, 237, 0.45)',
    experienceLevel: 'Production Stack',
    role: 'Containerization & Environments',
    tagline: 'Multi-Stage Dockerfile Builds, Docker-Compose Microservices',
    highlights: [
      'Multi-stage Alpine Linux builds for minimal image footprints',
      'Docker Compose orchestration for multi-service apps (Web + Redis + DB)',
      'Complete environment parity between development and deployment',
    ],
  },
  'Git': {
    color: '#F05032',
    glow: 'rgba(240, 80, 50, 0.4)',
    experienceLevel: 'Core Stack',
    role: 'Distributed Version Control',
    tagline: 'Branching Workflows, Rebase, Cherry-Pick, Conflict Resolution',
    highlights: [
      'Feature-branch workflows, rebasing, and atomic conventional commits',
      'Conflict resolution and clean linear repository histories',
      'Tagging, releases, and multi-remote origin synchronization',
    ],
  },
  'GitHub': {
    color: '#C084FC',
    glow: 'rgba(192, 132, 252, 0.4)',
    experienceLevel: 'Core Stack',
    role: 'CI/CD Automation & Collaboration',
    tagline: 'GitHub Actions Workflows, Repository Management, Code Reviews',
    highlights: [
      'GitHub Actions automated build, test, and deployment workflows',
      'Branch protection rules, pull request reviews, and issue tracking',
      'Open-source repository maintenance and automated status checks',
    ],
  },
  'Google Antigravity': {
    color: '#4285F4',
    glow: 'rgba(66, 133, 244, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Agentic AI Coding Assistant & Autonomous IDE',
    tagline: 'Google DeepMind Agentic Coding, Autonomous Tool Use, Self-Healing Code & Proactive Pair Programming',
    highlights: [
      'DeepMind agentic coding loop with automated CLI execution, MCP server tools, and background task management',
      'Contextual multi-file repo architecture analysis and reactive automated verification',
      'Autonomous subagent orchestration with browser validation, API testing, and terminal diagnostics',
      'Deep integration with Gemini multimodal models and native developer toolchains',
    ],
  },
  'Windsurf': {
    color: '#00C896',
    glow: 'rgba(0, 200, 150, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Agentic AI-Native IDE & Cascade Engine',
    tagline: 'Cascade Flow Workflows, Deep Real-Time Codebase Indexing & Collaborative Agentic Coding',
    highlights: [
      'Cascade flow engine for multi-step contextual code authoring and instant command execution',
      'Deep vector codebase indexing with semantic awareness across monolithic & microservice repositories',
      'Real-time proactive suggestions and multi-file synchronized refactoring with zero latency',
      'Seamless local terminal commands, Git conflict resolution, and integrated test runner flows',
    ],
  },
  'Devin AI': {
    color: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.45)',
    experienceLevel: 'Production Stack',
    role: 'Autonomous AI Software Engineer',
    tagline: 'End-to-End Autonomous Software Engineering, Sandbox Execution, Self-Debugging & Automated PRs',
    highlights: [
      'Autonomous end-to-end bug fixing, legacy migrations, and full feature lifecycle delivery',
      'Isolated sandbox execution environment with terminal, web browser, and code editor control',
      'Self-directed iterative debugging with unit test validation and performance benchmark verification',
      'Automated GitHub pull request generation with comprehensive changelogs and architectural documentation',
    ],
  },
  'Claude': {
    color: '#D97706',
    glow: 'rgba(217, 119, 6, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Autonomous Agentic AI & Code Intelligence',
    tagline: 'Claude Fable 5.1 & Opus 5.5, Claude Code CLI & Autonomous Workflows',
    highlights: [
      'Claude Code CLI for autonomous terminal pair-programming and multi-file architecture refactoring',
      'Claude Fable 5.1 & Opus 5.5 for long-horizon agentic reasoning and complex code synthesis',
      'Agentic tool-use, multi-step execution loops, and massive context-window orchestration',
      'System prompt engineering, automated test execution, and autonomous CI/CD debugging',
    ],
  },
  'DeepSeek': {
    color: '#4D6BFE',
    glow: 'rgba(77, 107, 254, 0.45)',
    experienceLevel: 'Production Stack',
    role: 'Reasoning LLM & Open-Weights Inference',
    tagline: 'DeepSeek-V4.1-Flash, DeepSeek-V4 MoE & DeepSeek-R1 Reasoning Models',
    highlights: [
      'DeepSeek-R1 reinforcement learning reasoning models for algorithmic logic & deep debugging',
      'DeepSeek-V4.1-Flash & V4 high-throughput Mixture-of-Experts inference pipelines',
      'Local model deployment and evaluation using Ollama and vLLM runtimes',
      'Chain-of-thought analysis for complex systems architecture and database design',
    ],
  },
  'Gemini': {
    color: '#9B72CF',
    glow: 'rgba(155, 114, 207, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Generative AI & Multimodal LLM',
    tagline: 'Gemini 3.8 Flash, 3.8 Live & 3.1 Pro Multimodal Runtimes, Contextual Search & Live Agents',
    highlights: [
      'Gemini 3.8 Flash workhorse model for long-horizon coding, agentic reasoning & ultra-fast streaming',
      'Gemini 3.8 Live & 3.1 Pro for real-time multimodal interaction and deep reasoning',
      'Dynamic prompt engineering with structured function calling and live database grounding',
    ],
  },
  'Groq': {
    color: '#F55036',
    glow: 'rgba(245, 80, 54, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Ultra-Fast LPU Inference Engine',
    tagline: 'Groq LPU Hardware, 500+ T/s Realtime Inference & Whisper Speech Pipelines',
    highlights: [
      'LPU (Language Processing Unit) architecture delivering 500+ tokens/sec throughput',
      'Sub-second real-time speech-to-text integration with Groq Whisper Large V3',
      'High-speed open-weights LLM orchestration (Llama 3.3, DeepSeek, Qwen)',
      'Ultra-responsive streaming pipelines for voice agents and live interactive chat',
    ],
  },
  'Grok': {
    color: '#F8FAFC',
    glow: 'rgba(248, 250, 252, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'xAI Frontier Reasoning Model',
    tagline: 'xAI Grok 4.6 & Colossus Supercluster Inference, Real-Time Knowledge & Deep Logic',
    highlights: [
      'Grok 4.6 frontier model integration for deep analytical reasoning and creative problem-solving',
      'Real-time live knowledge synthesis and grounding via xAI APIs',
      'Mathematical proofs, algorithmic verification, and complex code synthesis',
      'Multi-provider fallback resilience alongside Claude, DeepSeek, and Gemini',
    ],
  },
  'Python ML': {
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.4)',
    experienceLevel: 'Proficient',
    role: 'Recommendation Algorithms',
    tagline: 'Content-Based & Collaborative Filtering Engines for Commerce',
    highlights: [
      'Cosine similarity algorithms for related item discovery',
      'User interaction matrix processing for personalized catalogs',
      'Lightweight Python microservice serving recommendations via REST',
    ],
  },
  'Razorpay': {
    color: '#0082FB',
    glow: 'rgba(0, 130, 251, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Fintech Payment Gateway',
    tagline: 'Checkout Modal, Webhook HMAC Verification, Auto-Refunds',
    highlights: [
      'Standard Checkout modal integration supporting UPI, Cards, NetBanking',
      'Server-side cryptographic HMAC SHA-256 webhook verification',
      'Automated order creation and database payment status reconciliation',
    ],
  },
  'Stripe': {
    color: '#635BFF',
    glow: 'rgba(99, 91, 255, 0.45)',
    experienceLevel: 'Production Stack',
    role: 'International Payment Orchestrator',
    tagline: 'Multi-Currency Checkout Sessions, Payment Intents & Webhooks',
    highlights: [
      'Multi-currency Stripe Checkout sessions for global customers',
      'Secure webhook event listeners for payment intent captures',
      'Unified dual-payment gateway routing abstraction layer',
    ],
  },
  'JWT': {
    color: '#FB015B',
    glow: 'rgba(251, 1, 91, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Stateless Security & Auth',
    tagline: 'Access/Refresh Token Flow, RBAC Claims, Secure HTTP-Only Cookies',
    highlights: [
      'Dual-token architecture (short-lived access + refresh tokens)',
      'Multi-role RBAC claims (Customer, Merchant, Admin, Courier)',
      'HTTP-Only, SameSite secure cookies to prevent XSS/CSRF exploits',
    ],
  },
  'VS Code': {
    color: '#007ACC',
    glow: 'rgba(0, 122, 204, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Primary Development Environment',
    tagline: 'Debugger Workflows, Git Integration, Extension Ecosystem & Productivity Snippets',
    highlights: [
      'Configured debugging profiles, launch.json configs, and terminal automation',
      'Deep Git source control integration with interactive merge and diff viewers',
      'TypeScript and ESLint language server integration for instant error detection',
      'Performance profiling and modular extension ecosystem management',
    ],
  },
  'UI/UX Design': {
    color: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'UI/UX & Product Design Architecture',
    tagline: 'Figma Prototyping, Design Systems, Responsive Micro-Interactions & WCAG Accessibility',
    highlights: [
      'High-fidelity interactive prototyping and scalable design systems in Figma',
      'Accessibility compliance (WCAG AA), high-contrast palettes, and keyboard navigation',
      'Tactile micro-interactions, spring physics transitions, and responsive fluid layouts',
      'Seamless design-to-code translation using Tailwind design tokens and CSS variables',
    ],
  },
  'Flipkart Smart Assist CRM': {
    color: '#2874F0',
    glow: 'rgba(40, 116, 240, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Flipkart Process Operations & Incident CRM',
    tagline: 'Flipkart Smart Assist CRM, Incident Triage, Ticket Lifecycle & Escalation Resolution',
    highlights: [
      'End-to-end incident management and ticket resolution inside Flipkart Smart Assist CRM',
      'High-speed handling of order exceptions, refund escalations, and seller-buyer dispute tracking',
      'Strict adherence to first-contact resolution (FCR) and operational turnaround times (TAT)',
      'Customer satisfaction (CSAT) optimization through empathetic and structured issue resolution',
    ],
  },
  'BPO & Customer Operations': {
    color: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'BPO Process & Customer Operations',
    tagline: 'Inbound/Outbound Workflows, SLA Compliance, Escalation Management & CSAT',
    highlights: [
      'Managing high-volume customer queries across omnichannel communication channels',
      'Strict SLA adherence, average handling time (AHT) control, and first-contact resolution (FCR)',
      'Quality audit calibration, call/chat monitoring, and agent coaching sessions',
      'Escalation matrix handling and customer satisfaction (CSAT/NPS) tracking',
    ],
  },
  'Microsoft Excel': {
    color: '#107C41',
    glow: 'rgba(16, 124, 65, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Advanced Data Modeling & MIS Reporting',
    tagline: 'VLOOKUP/XLOOKUP, Dynamic Pivot Tables, Data Reconciliation & Operational Dashboards',
    highlights: [
      'Advanced formulas (XLOOKUP, INDEX/MATCH, nested IFs, SUMIFS, dynamic arrays)',
      'Pivot tables, calculated fields, and multi-source data consolidation for MIS reports',
      'Data cleaning, conditional formatting, deduplication, and reconciliation audits',
      'Automated operational report templates tracking daily team throughput and KPIs',
    ],
  },
  'Power BI': {
    color: '#F2C811',
    glow: 'rgba(242, 200, 17, 0.45)',
    experienceLevel: 'Proficient',
    role: 'Business Intelligence & Visual Analytics',
    tagline: 'Interactive KPI Dashboards, DAX Measures, Incident Trends & Operations Analytics',
    highlights: [
      'Building interactive executive dashboards with drill-down and cross-filtering capabilities',
      'Tracking operational metrics, ticket resolution TAT, and process SLA trends',
      'Connecting diverse data sources and building star-schema data models with DAX measures',
      'Visualizing supply chain, sales, and delivery exceptions with automated schedule refreshes',
    ],
  },
  'MS Office Suite': {
    color: '#EA3E23',
    glow: 'rgba(234, 62, 35, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Executive Reporting & Documentation',
    tagline: 'PowerPoint Presentations, Word SOPs, Executive Pitch Decks & Formal Reporting',
    highlights: [
      'Crafting professional PowerPoint decks for process reviews, training, and client demos',
      'Authoring standard operating procedures (SOPs), flowcharts, and policy manuals in MS Word',
      'Formatting complex business reports with typography, headers, and branded style guides',
      'Cross-suite productivity integration between Excel tables, Word docs, and PowerPoint',
    ],
  },
  'Video Editing': {
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.45)',
    experienceLevel: 'Proficient',
    role: 'Creative Media & Video Production',
    tagline: 'Timeline Sequencing, Video Pacing, B-Roll Integration, Audio Sync & Color Correction',
    highlights: [
      'Multi-track timeline cutting, dynamic pacing, and narrative storytelling',
      'Audio cleanup, sound effects layering, background music balancing, and sync',
      'Color correction, LUT application, motion graphics, and subtitle synchronization',
      'Rendering high-definition content optimized for YouTube, Instagram, and web portals',
    ],
  },
  'Supply Chain & Logistics': {
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'E-Commerce Logistics & Supply Chain Flow',
    tagline: 'Order Dispatch, Reverse Logistics, Warehouse Coordination & Transit Tracking',
    highlights: [
      'Coordinating e-commerce dispatch schedules, hub handovers, and last-mile tracking',
      'Managing reverse logistics workflows for returns, replacements, and warehouse inspection',
      'Inventory reconciliation, shrinkage control, and stock discrepancy investigation',
      'Partner logistics SLA tracking and courier performance monitoring',
    ],
  },
  'Quality Control & Six Sigma': {
    color: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.45)',
    experienceLevel: 'Production Stack',
    role: 'Quality Assurance & Process Compliance',
    tagline: 'Standard Operating Procedures (SOPs), 5S Methodology, Defect Minimization & Audits',
    highlights: [
      'Conducting incoming, in-process, and final quality inspections against specifications',
      'Developing and maintaining Standard Operating Procedures (SOPs) and checklists',
      'Root-cause defect analysis using 5-Why and Fishbone frameworks for continuous improvement',
      'Adherence to 5S workspace cleanliness, safety protocols, and compliance standards',
    ],
  },
  'Team Leadership & Operations': {
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Operations Leadership & Workforce Direction',
    tagline: 'Shift Scheduling, Performance KPIs, Cross-Functional Leadership & Training Mentorship',
    highlights: [
      'Managing shift rosters, attendance tracking, and workforce capacity balancing',
      'Setting operational KPIs, conducting appraisals, and driving team performance reviews',
      'Conflict resolution, cross-functional team mediation, and team motivation',
      'Conducting onboarding bootcamps and process training for new personnel',
    ],
  },
  'Process Optimization': {
    color: '#14B8A6',
    glow: 'rgba(20, 184, 166, 0.45)',
    experienceLevel: 'Core Stack',
    role: 'Operational Efficiency & SOP Scaling',
    tagline: 'Workflow Bottleneck Identification, Lean Principles, Cost Reduction & SOPs',
    highlights: [
      'Mapping end-to-end workflows to isolate non-value-added steps and bottlenecks',
      'Implementing Lean operational practices to reduce operational expenditure and cycle times',
      'Drafting scalable SOP documentation for error-free operational replication',
      'Establishing quantitative benchmark dashboards for operational throughput monitoring',
    ],
  },
};

const defaultMeta: TechMeta = {
  color: '#A855F7',
  glow: 'rgba(168, 85, 247, 0.35)',
  experienceLevel: 'Production Stack',
  role: 'Production Engineering Tool',
  tagline: 'Industry-standard technology integrated into full-stack systems',
  highlights: [
    'Integrated into live web platforms and architectural backends',
    'Maintained in version control and production environments',
  ],
};

export function TechEcosystem() {
  const [selectedSkillName, setSelectedSkillName] = useState<string>('Next.js');
  const [activeDomain, setActiveDomain] = useState<'All' | 'IT' | 'Non-IT'>('IT');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isHighlightsOpen, setIsHighlightsOpen] = useState<boolean>(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);

  const INITIAL_DISPLAY_LIMIT = 16;

  const itSkillCount = useMemo(() => skills.filter((s) => (s.domain || 'IT') === 'IT').length, []);
  const nonItSkillCount = useMemo(() => skills.filter((s) => s.domain === 'Non-IT').length, []);
  const totalSkillCount = skills.length;

  // Dynamically compute available categories for the selected domain
  const availableCategories = useMemo(() => {
    const domainPool =
      activeDomain === 'All'
        ? skills
        : skills.filter((s) => (s.domain || 'IT') === activeDomain);

    const preferredOrder = [
      'Frontend',
      'Backend',
      'Database',
      'Realtime',
      'Cloud',
      'DevOps',
      'AI',
      'Tools',
      'Design',
      'BPO & Operations',
      'Office & Analytics',
      'Creative & Media',
      'Supply Chain',
      'Manufacturing',
      'Management',
    ];

    const presentCategories = new Set(domainPool.map((s) => s.category));
    const sorted = preferredOrder.filter((cat) => presentCategories.has(cat));
    presentCategories.forEach((cat) => {
      if (!sorted.includes(cat)) sorted.push(cat);
    });

    return ['All', ...sorted];
  }, [activeDomain]);

  // Handler for domain change (resets category, expansion, and smoothly handles inspector selection)
  const handleDomainChange = (domain: 'All' | 'IT' | 'Non-IT') => {
    setActiveDomain(domain);
    setActiveCategory('All');
    setIsExpanded(false);
    if (domain !== 'All') {
      const currentSkillDomain = selectedSkill?.domain || 'IT';
      if (currentSkillDomain !== domain) {
        const firstInDomain = skills.find((s) => (s.domain || 'IT') === domain);
        if (firstInDomain) {
          setSelectedSkillName(firstInDomain.name);
        }
      }
    }
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setIsExpanded(false);
  };

  // Filter skills based on Domain + Category + Realtime Search Query
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const skillDomain = skill.domain || 'IT';
      const matchesDomain = activeDomain === 'All' || skillDomain === activeDomain;
      const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Boolean(skill.description) && skill.description!.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDomain && matchesCategory && matchesSearch;
    });
  }, [activeDomain, activeCategory, searchQuery]);

  // Progressive disclosure: cap initial display at INITIAL_DISPLAY_LIMIT unless expanded, searching, or filtering by specific category
  const displayedSkills = useMemo(() => {
    if (searchQuery.trim().length > 0 || activeCategory !== 'All' || isExpanded) {
      return filteredSkills;
    }
    return filteredSkills.slice(0, INITIAL_DISPLAY_LIMIT);
  }, [filteredSkills, searchQuery, activeCategory, isExpanded]);

  const selectedSkill = skills.find((s) => s.name === selectedSkillName) || filteredSkills[0] || skills[0];
  const selectedMeta = techMetadata[selectedSkill?.name || 'Next.js'] || defaultMeta;

  return (
    <section id="skills" className="pt-2 sm:pt-4 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-400 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Production Stack &amp; Architectural Arsenal</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Engineering &amp; Skill <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">Ecosystem</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-2">
            Explore the core technical runtimes, databases, AI models, and professional non-IT leadership skills powering scalable systems.
          </p>
        </div>

        {/* Global Stats Counter */}
        <div className="flex items-center gap-3 sm:gap-4 bg-surface/90 border border-border p-2 sm:p-2.5 px-3.5 sm:px-4 rounded-2xl backdrop-blur-md self-start md:self-auto shadow-xs font-mono text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase">Technical Stack</span>
            <span className="font-bold text-cyan-400 text-sm">{itSkillCount} IT Skills</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase">Professional</span>
            <span className="font-bold text-pink-400 text-sm">{nonItSkillCount} Non-IT</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase">Total</span>
            <span className="font-bold text-foreground text-sm">{totalSkillCount} Active</span>
          </div>
        </div>
      </div>

      {/* Tier 1: Sleek Domain Filter (All Domains / IT & Technical / Non-IT & Professional) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 sm:p-2.5 rounded-2xl bg-surface/70 border border-border/80 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-background/80 border border-border/60">
          {/* All Domains Tab */}
          <button
            type="button"
            onClick={() => handleDomainChange('All')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeDomain === 'All'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Domains</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeDomain === 'All'
                  ? 'bg-white/25 text-white font-bold'
                  : 'bg-surface-elevated text-muted-foreground'
              }`}
            >
              {totalSkillCount}
            </span>
          </button>

          {/* IT & Technical Tab */}
          <button
            type="button"
            onClick={() => handleDomainChange('IT')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeDomain === 'IT'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>IT &amp; Technical</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeDomain === 'IT'
                  ? 'bg-slate-950/20 text-slate-950 font-bold'
                  : 'bg-surface-elevated text-muted-foreground'
              }`}
            >
              {itSkillCount}
            </span>
          </button>

          {/* Non-IT & Professional Tab */}
          <button
            type="button"
            onClick={() => handleDomainChange('Non-IT')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeDomain === 'Non-IT'
                ? 'bg-pink-500 text-white font-bold shadow-md shadow-pink-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Non-IT &amp; Professional</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeDomain === 'Non-IT'
                  ? 'bg-white/25 text-white font-bold'
                  : 'bg-surface-elevated text-muted-foreground'
              }`}
            >
              {nonItSkillCount}
            </span>
          </button>
        </div>

        {/* Domain Scope Helper Text */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground px-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate">
            {activeDomain === 'All' && 'Complete Technical & Non-IT Operations Arsenal'}
            {activeDomain === 'IT' && 'Software Architecture, Agentic Coding & AI, Cloud, Modern IDEs & UI/UX'}
            {activeDomain === 'Non-IT' && 'Flipkart BPO CRM, MS Excel, Power BI, Supply Chain & Media'}
          </span>
        </div>
      </div>

      {/* Tier 2: Dynamic Category Filter Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Dynamic Categories Pills */}
        <div className="flex overflow-x-auto items-center gap-1.5 bg-surface/90 border border-border p-1.5 rounded-2xl backdrop-blur-md mobile-scroll-x">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            placeholder="Search technology or skill..."
            className="w-full pl-8 pr-4 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:border-purple-500 placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Bento Cards, Right Sticky Command Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Tech Cards Grid with stabilized min-height to prevent page jump on filter */}
        <div className="lg:col-span-7 xl:col-span-7 min-h-[460px] sm:min-h-[520px]">
          {filteredSkills.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
              <Cpu className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-foreground font-semibold">No technologies matched &quot;{searchQuery}&quot;</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-xs text-purple-400 font-mono hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {displayedSkills.map((skill) => {
                  const isSelected = selectedSkill.name === skill.name;
                  const meta = techMetadata[skill.name] || defaultMeta;

                  return (
                    <button
                      key={skill.name}
                      type="button"
                      onClick={() => setSelectedSkillName(skill.name)}
                      className={`group relative p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
                        isSelected
                          ? 'border-purple-500 bg-surface-elevated shadow-xl scale-[1.02] ring-1 ring-purple-500/50'
                          : 'border-border bg-card/80 hover:bg-surface-elevated hover:border-purple-500/40 hover:shadow-lg hover:-translate-y-0.5'
                      }`}
                      style={{
                        boxShadow: isSelected ? `0 10px 25px -5px ${meta.glow}` : undefined,
                      }}
                      data-cursor="INSPECT"
                    >
                      {/* Dynamic Ambient Hover Glow Behind Icon */}
                      <div
                        className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl pointer-events-none"
                        style={{ backgroundColor: meta.color }}
                      />

                      {/* Top Row: Icon container + Tech Type Tag */}
                      <div className="flex items-center justify-between mb-3 w-full">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-110 shadow-inner"
                          style={{
                            backgroundColor: `${meta.color}15`,
                            border: `1px solid ${meta.color}35`,
                          }}
                        >
                          <TechIcon name={skill.name} className="w-5 h-5 shrink-0" />
                        </div>

                        <div className="flex items-center gap-1">
                          {skill.domain === 'Non-IT' && (
                            <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-md font-bold tracking-wider bg-pink-500/15 text-pink-300 border border-pink-500/30">
                              Non-IT
                            </span>
                          )}
                          <span
                            className="text-[9px] font-mono px-2 py-0.5 rounded-md font-bold tracking-wider border truncate max-w-[120px]"
                            style={{
                              backgroundColor: `${meta.color}15`,
                              color: meta.color === '#000000' || meta.color === '#E2E8F0' ? '#C084FC' : meta.color,
                              borderColor: `${meta.color}40`,
                            }}
                            title={getTechType(skill.name, skill.category)}
                          >
                            {getShortType(skill.name, skill.category)}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Name + Clear Role */}
                      <div>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-purple-300 transition-colors tracking-tight truncate">
                          {skill.name}
                        </h4>
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate" title={meta.role}>
                          {meta.role || skill.description || skill.category}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progressive Disclosure Controller (Expand / Collapse for 16+ skills) */}
              {filteredSkills.length > INITIAL_DISPLAY_LIMIT && !searchQuery && activeCategory === 'All' && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface/70 border border-border/80 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md">
                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>
                      Showing <strong className="text-foreground font-semibold">{displayedSkills.length}</strong> of{' '}
                      <strong className="text-foreground font-semibold">{filteredSkills.length}</strong> {activeDomain === 'All' ? 'Ecosystem' : activeDomain} Technologies
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-300 ease-out cursor-pointer bg-purple-100 hover:bg-purple-200/90 text-purple-950 border border-purple-300/90 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-500/50 dark:hover:bg-purple-900/80 shadow-xs hover:shadow-sm hover:scale-102 active:scale-95"
                  >
                    <span>
                      {isExpanded
                        ? 'Show Less (Collapse)'
                        : `View All ${filteredSkills.length} Technologies (+${filteredSkills.length - INITIAL_DISPLAY_LIMIT} more)`}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" /> : <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Dedicated Interactive Tech Command Center */}
        <div className="lg:col-span-5 xl:col-span-5 sticky top-28 space-y-6">
          <div
            className="rounded-3xl border bg-card/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-300"
            style={{
              borderColor: `${selectedMeta.color}50`,
              boxShadow: `0 20px 40px -15px ${selectedMeta.glow}`,
            }}
          >
            {/* Ambient Radial Spotlight inside inspector */}
            <div
              className="absolute -top-20 -right-20 w-52 h-52 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ backgroundColor: selectedMeta.color }}
            />

            {/* Inspector Top Bar */}
            <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Technology Inspector
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold tracking-wider border"
                  style={{
                    backgroundColor: `${selectedMeta.color}15`,
                    color: selectedMeta.color === '#000000' || selectedMeta.color === '#E2E8F0' ? '#C084FC' : selectedMeta.color,
                    borderColor: `${selectedMeta.color}40`,
                  }}
                >
                  Type: {getShortType(selectedSkill.name, selectedSkill.category)}
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-semibold text-muted-foreground bg-surface border border-border">
                  {selectedSkill.domain === 'Non-IT' ? 'Professional Non-IT' : 'IT Technical'}
                </span>
              </div>
            </div>

            {/* Showcase Hero: Big Animated Icon + Title */}
            <div className="flex items-center gap-3.5 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center p-2.5 shadow-xl shrink-0"
                style={{
                  backgroundColor: `${selectedMeta.color}15`,
                  border: `1.5px solid ${selectedMeta.color}40`,
                  boxShadow: `0 8px 20px -4px ${selectedMeta.glow}`,
                }}
              >
                <TechIcon name={selectedSkill.name} className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                  <span>{selectedSkill.name}</span>
                </h3>
                <p className="text-xs font-mono text-purple-400 font-semibold mt-0.5">
                  {selectedMeta.role}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-muted-foreground mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      (selectedSkill.domain || 'IT') === 'Non-IT'
                        ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
                        : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {selectedSkill.domain || 'IT'}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-foreground bg-surface px-2 py-0.5 rounded-md border border-border">
                    {getTechType(selectedSkill.name, selectedSkill.category)}
                  </span>
                  <span>•</span>
                  <span>Category: {selectedSkill.category}</span>
                </div>
              </div>
            </div>

            {/* Real Production Scope Summary */}
            <div className="bg-surface/80 border border-border p-3.5 rounded-2xl space-y-1.5 mb-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Production Deployment:</span>
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {selectedSkill.projects && selectedSkill.projects.length > 0
                    ? `Active in ${selectedSkill.projects.length} ${selectedSkill.projects.length === 1 ? 'Platform' : 'Platforms'}`
                    : 'Engineering Standard'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                {selectedMeta.tagline}
              </p>
            </div>

            {/* Architectural / Strategic Overview */}
            <div className="space-y-1.5 mb-5">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                {selectedSkill.domain === 'Non-IT' ? 'Strategic & Leadership Overview' : 'Architectural Overview'}
              </span>
              <p className="text-xs text-foreground/90 leading-relaxed bg-surface/80 border border-border p-3.5 rounded-2xl">
                {selectedSkill.description || selectedMeta.tagline}
              </p>
            </div>

            {/* Key Engineering / Professional Highlights (Collapsible, closed by default) */}
            {selectedMeta.highlights && selectedMeta.highlights.length > 0 && (
              <div className="mb-4 rounded-2xl bg-surface/60 border border-border overflow-hidden transition-colors">
                <button
                  type="button"
                  onClick={() => setIsHighlightsOpen((prev) => !prev)}
                  aria-expanded={isHighlightsOpen}
                  className="w-full flex items-center justify-between gap-3 p-3 sm:p-3.5 text-left hover:bg-surface-elevated/60 transition-colors cursor-pointer group"
                >
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-foreground font-semibold flex items-center gap-2 min-w-0">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">
                      {selectedSkill.domain === 'Non-IT' ? 'Key Leadership & Impact Highlights' : 'Key Engineering Highlights'}
                    </span>
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-surface border border-border text-muted-foreground whitespace-nowrap shrink-0">
                      {selectedMeta.highlights.length} Items
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200 shrink-0 ${
                        isHighlightsOpen ? 'rotate-180 text-purple-400' : ''
                      }`}
                    />
                  </div>
                </button>

                {isHighlightsOpen && (
                  <div className="px-3 sm:px-3.5 pb-3.5 pt-1 space-y-1.5 animate-in fade-in-0 slide-in-from-top-1 duration-200 border-t border-border/50">
                    {selectedMeta.highlights.map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-surface/80 border border-border/80 text-xs font-mono text-foreground/90 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11px]">{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Deployed In Production Projects (Collapsible, closed by default) */}
            {selectedSkill.projects && selectedSkill.projects.length > 0 && (
              <div className="rounded-2xl bg-surface/60 border border-border overflow-hidden transition-colors">
                <button
                  type="button"
                  onClick={() => setIsProjectsOpen((prev) => !prev)}
                  aria-expanded={isProjectsOpen}
                  className="w-full flex items-center justify-between gap-3 p-3 sm:p-3.5 text-left hover:bg-surface-elevated/60 transition-colors cursor-pointer group"
                >
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-foreground font-semibold flex items-center gap-2 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">Deployed In Featured Projects</span>
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-surface border border-border text-muted-foreground whitespace-nowrap shrink-0">
                      {selectedSkill.projects.length} {selectedSkill.projects.length === 1 ? 'Project' : 'Projects'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200 shrink-0 ${
                        isProjectsOpen ? 'rotate-180 text-purple-400' : ''
                      }`}
                    />
                  </div>
                </button>

                {isProjectsOpen && (
                  <div className="px-3 sm:px-3.5 pb-3.5 pt-1 flex flex-col gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-200 border-t border-border/50">
                    {selectedSkill.projects.map((projSlug) => {
                      const projectObj = projects.find((p) => p.slug === projSlug);
                      return (
                        <Link
                          key={projSlug}
                          href={`/work/${projSlug}`}
                          className="group/proj flex items-center justify-between p-2.5 rounded-xl bg-surface/90 border border-border hover:border-purple-500/50 hover:bg-surface-elevated transition-all shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <div>
                              <span className="text-xs font-bold text-foreground group-hover/proj:text-purple-400 transition-colors">
                                {projectObj?.name || projSlug}
                              </span>
                              {projectObj?.tagline && (
                                <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[200px]">
                                  {projectObj.tagline}
                                </p>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover/proj:text-purple-400 transition-transform group-hover/proj:translate-x-0.5" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechEcosystem;
