import { Project, Skill, Experience, NavItem } from '@/types';

/* ============================================
   NAVIGATION
   ============================================ */
export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Engineering', href: '/engineering' },
  { label: 'AI Lab', href: '/ai-lab' },
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Contact', href: '/contact' },
];

/* ============================================
   PERSONAL INFO
   ============================================ */
export const personalInfo = {
  name: 'Rahul Raj',
  role: 'Full-Stack Engineer',
  tagline: 'AI × Product × Real-Time Systems',
  bio: 'I design and engineer digital products where thoughtful interfaces meet robust systems.',
  github: 'https://github.com/Rahul-2148',
  email: 'rahulraj2148@gmail.com',
  location: 'India',
  available: true,
};

/* ============================================
   PROJECTS — Curated from GitHub Analysis
   ============================================ */
export const projects: Project[] = [
  /* ─── TIER S: Flagships ─── */
  {
    slug: 'zosh-bazaar',
    name: 'Zosh Bazaar',
    tagline: 'Enterprise Multi-Vendor E-Commerce Platform',
    description:
      'An industry-grade, event-driven multi-vendor marketplace with 5 specialized micro-frontends, real-time logistics, and AI-powered shopping assistant. Decoupled architecture serving customers, merchants, logistics operators, platform admins, and delivery agents through dedicated interfaces.',
    category: 'E-commerce',
    tier: 'S',
    type: 'Full-Stack Platform',
    technologies: [
      'React 19',
      'TypeScript',
      'Node.js',
      'Express',
      'MongoDB Atlas',
      'Socket.IO',
      'Razorpay',
      'Cloudinary',
      'Python',
      'Vite',
      'Tailwind CSS',
      'JWT',
    ],
    features: [
      '5-portal micro-frontend ecosystem',
      'Real-time WebSocket event architecture',
      'Multi-role RBAC (Customer, Seller, Admin, Logistics, Delivery)',
      'AI shopping chatbot assistant',
      'Razorpay payment integration with webhook verification',
      'Cloudinary media asset pipeline',
      'OTP delivery verification handshake',
      'Automated hub dispatch & logistics routing',
      'Pincode-based serviceability detection',
      'Geolocation reverse geocoding',
    ],
    links: {
      github: 'https://github.com/Rahul-2148/Zosh-Bazaar-Multivendor-Ecommerce',
    },
    color: '#00d4ff',
    year: '2025–2026',
    role: 'Solo Full-Stack Engineer',
    architecture: [
      {
        id: 'storefront',
        label: 'Customer Storefront',
        type: 'client',
        description: 'Product discovery, cart, checkout, AI chatbot. Port 5173.',
        technology: 'React + Vite + TypeScript',
        x: 10,
        y: 10,
        connections: ['gateway'],
      },
      {
        id: 'seller',
        label: 'Merchant Console',
        type: 'client',
        description: 'Catalog management, media uploads, fulfillment tracking, payout metrics.',
        technology: 'React + Vite',
        x: 30,
        y: 10,
        connections: ['gateway'],
      },
      {
        id: 'admin',
        label: 'Platform Admin',
        type: 'client',
        description: 'Vendor KYC audits, category management, commission policies, disputes.',
        technology: 'React + Vite',
        x: 50,
        y: 10,
        connections: ['gateway'],
      },
      {
        id: 'logistics',
        label: 'Logistics Tower',
        type: 'client',
        description: 'Hub routing, package manifests, real-time driver tracking.',
        technology: 'React + Vite',
        x: 70,
        y: 10,
        connections: ['gateway'],
      },
      {
        id: 'delivery',
        label: 'Delivery App',
        type: 'client',
        description: 'Active delivery queue, OTP verification, contactless proof of delivery.',
        technology: 'React + Vite',
        x: 90,
        y: 10,
        connections: ['gateway'],
      },
      {
        id: 'gateway',
        label: 'Zosh Gateway Server',
        type: 'server',
        description: 'Central REST API + Socket.IO hub. JWT auth, dynamic CORS, scheduled workers.',
        technology: 'Node.js + Express + Socket.IO',
        x: 50,
        y: 45,
        connections: ['mongodb', 'cloudinary', 'razorpay'],
      },
      {
        id: 'mongodb',
        label: 'MongoDB Atlas',
        type: 'database',
        description: 'Multi-collection database cluster with indexed queries.',
        technology: 'MongoDB + Mongoose',
        x: 25,
        y: 80,
        connections: [],
      },
      {
        id: 'cloudinary',
        label: 'Cloudinary CDN',
        type: 'external',
        description: 'Optimized media asset storage with automated thumbnail extraction.',
        technology: 'Cloudinary SDK',
        x: 50,
        y: 80,
        connections: [],
      },
      {
        id: 'razorpay',
        label: 'Razorpay Gateway',
        type: 'external',
        description: 'Checkout & payment verification with webhook callbacks.',
        technology: 'Razorpay SDK',
        x: 75,
        y: 80,
        connections: [],
      },
    ],
    challenges: [
      {
        title: 'Multi-Portal Real-Time State Synchronization',
        problem:
          'Five independent frontend apps needed to reflect order state changes in real-time across customer, seller, admin, logistics, and delivery portals simultaneously.',
        solution:
          'Implemented Socket.IO room subscriptions scoped by role and entity ID (e.g., seller_{sellerId}), with a centralized event bus on the gateway server broadcasting state transitions.',
        impact: 'Instant cross-portal updates without polling, enabling real-time logistics coordination.',
      },
      {
        title: 'Scalable Role-Based Access Control',
        problem:
          'Five distinct user personas with overlapping but different access patterns across shared API endpoints.',
        solution:
          'Built a middleware-driven RBAC system with JWT claims carrying role+entity scopes, validated at each route handler.',
        impact: 'Clean separation of concerns with a single API serving all five portals securely.',
      },
    ],
    decisions: [
      {
        problem: 'Should we use a monolithic frontend or separate micro-frontends?',
        options: ['Single React app with role-based routing', 'Separate Vite apps per portal'],
        decision: 'Separate Vite apps per portal',
        tradeoff:
          'Higher initial setup complexity but each portal can be independently deployed and scaled.',
        result: 'Clear separation of concerns, smaller bundle sizes per portal, independent deploy cycles.',
      },
    ],
  },
  {
    slug: 'snapcart',
    name: 'Snapcart',
    tagline: '10-Minute Grocery Delivery Platform',
    description:
      'A full-stack rapid grocery delivery platform with real-time order tracking, dual payment gateway integration, product discovery engine, and a Python ML recommendation service. Built as a production-ready system with Docker deployment.',
    category: 'E-commerce',
    tier: 'S',
    type: 'Full-Stack Platform',
    technologies: [
      'Next.js',
      'TypeScript',
      'MongoDB',
      'Mongoose',
      'Redis',
      'Socket.IO',
      'Stripe',
      'Razorpay',
      'Cloudinary',
      'Python',
      'Docker',
      'JWT',
    ],
    features: [
      'Real-time delivery tracking via Socket.IO',
      'Dual payment: Stripe + Razorpay integration',
      'Product discovery & search engine',
      'Python ML recommendation service',
      'Redis caching layer',
      'Cart, wishlist, orders, returns',
      'Location-based delivery',
      'Cloudinary media pipeline',
      'Docker containerization',
      'Role-based authentication',
    ],
    links: {
      live: 'https://snapcart-psi.vercel.app',
      github: 'https://github.com/Rahul-2148/snapcart',
    },
    color: '#00c853',
    year: '2026',
    role: 'Solo Full-Stack Engineer',
    architecture: [
      {
        id: 'nextjs',
        label: 'Next.js Application',
        type: 'client',
        description: 'SSR/SSG frontend with product pages, cart, checkout flow.',
        technology: 'Next.js + TypeScript',
        x: 50,
        y: 10,
        connections: ['api'],
      },
      {
        id: 'api',
        label: 'API Layer',
        type: 'server',
        description: 'RESTful API with auth, business logic, order management.',
        technology: 'Node.js + Express',
        x: 50,
        y: 35,
        connections: ['mongodb', 'redis', 'socketio', 'ml'],
      },
      {
        id: 'mongodb',
        label: 'MongoDB',
        type: 'database',
        description: 'Primary data store for products, users, orders.',
        technology: 'MongoDB + Mongoose',
        x: 20,
        y: 65,
        connections: [],
      },
      {
        id: 'redis',
        label: 'Redis Cache',
        type: 'database',
        description: 'Session cache, rate limiting, real-time data.',
        technology: 'Redis',
        x: 40,
        y: 65,
        connections: [],
      },
      {
        id: 'socketio',
        label: 'Real-Time Layer',
        type: 'service',
        description: 'WebSocket connections for live delivery tracking.',
        technology: 'Socket.IO',
        x: 60,
        y: 65,
        connections: [],
      },
      {
        id: 'ml',
        label: 'ML Engine',
        type: 'service',
        description: 'Product recommendations and search relevance.',
        technology: 'Python',
        x: 80,
        y: 65,
        connections: [],
      },
    ],
    challenges: [
      {
        title: 'Dual Payment Gateway Orchestration',
        problem: 'Supporting both Stripe (international) and Razorpay (India) in a single checkout flow.',
        solution:
          'Built a payment provider abstraction layer that routes based on user locale and preference, with unified webhook handlers for both gateways.',
        impact: 'Seamless checkout regardless of payment provider, with consistent order state management.',
      },
      {
        title: 'Real-Time Delivery Tracking at Scale',
        problem: 'Live order status updates from pickup to delivery without overwhelming the server.',
        solution:
          'Socket.IO rooms scoped to order IDs, with Redis pub/sub for horizontal scalability.',
        impact: 'Sub-second delivery status updates visible to both customer and delivery partner.',
      },
    ],
  },

  /* ─── TIER A: Featured ─── */
  {
    slug: 'vybe',
    name: 'VYBE',
    tagline: 'Social Media Platform',
    description:
      'A full-featured Instagram-style social platform with reels, stories, posts, notes, real-time messaging, and communities. Massive JavaScript codebase (4.4M+ bytes) with rich interactive features.',
    category: 'Social',
    tier: 'A',
    type: 'Full-Stack Application',
    technologies: [
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Socket.IO',
      'Cloudinary',
      'CSS',
    ],
    features: [
      'Reels with video playback engine',
      'Stories with 24h lifecycle',
      'Posts with comments & likes',
      'Notes (text-based updates)',
      'Real-time messaging via Socket.IO',
      'Communities/groups',
      'User profiles & followers',
      'Media upload via Cloudinary',
    ],
    links: {
      live: 'https://vybe-rust-eight.vercel.app',
      github: 'https://github.com/Rahul-2148/VYBE',
    },
    color: '#e040fb',
    year: '2026',
    role: 'Solo Full-Stack Engineer',
  },
  {
    slug: 'zaykahub',
    name: 'ZaykaHub',
    tagline: 'Full-Stack Food Delivery Platform',
    description:
      'A comprehensive food delivery platform with secure JWT authentication, dynamic menu search, interactive cart, real-time order tracking, dual payment checkout (Stripe & Razorpay), and an admin dashboard.',
    category: 'E-commerce',
    tier: 'A',
    type: 'Full-Stack Application',
    technologies: [
      'TypeScript',
      'React',
      'Vite',
      'Node.js',
      'Express',
      'MongoDB',
      'Stripe',
      'Razorpay',
      'Cloudinary',
      'JWT',
      'Zustand',
    ],
    features: [
      'JWT authentication with refresh tokens',
      'Dynamic restaurant & menu search',
      'Interactive cart with real-time pricing',
      'Dual payment: Stripe + Razorpay',
      'Real-time order tracking',
      'Admin dashboard for restaurant management',
      'Cloudinary media management',
      'Responsive mobile-first design',
    ],
    links: {
      live: 'https://zayka-hub-food-app-gamma.vercel.app',
      github: 'https://github.com/Rahul-2148/ZaykaHub_food-app',
    },
    color: '#ff6d00',
    year: '2026',
    role: 'Solo Full-Stack Engineer',
  },

  /* ─── TIER B: Supporting ─── */
  {
    slug: 'streamify',
    name: 'Streamify',
    tagline: 'Video Calling Web Application',
    description:
      'A real-time video calling platform with WebRTC-based communication, supporting group calls and screen sharing.',
    category: 'Realtime',
    tier: 'B',
    type: 'Real-Time Application',
    technologies: ['JavaScript', 'Node.js', 'WebRTC', 'Socket.IO', 'CSS'],
    features: [
      'Video & audio calling',
      'Real-time WebRTC connections',
      'Screen sharing',
      'Call management',
    ],
    links: {
      github: 'https://github.com/Rahul-2148/streamify-video-calls',
    },
    color: '#448aff',
    year: '2025',
    role: 'Solo Developer',
  },
  {
    slug: 'arogya-hope',
    name: 'Arogya Hope Foundation',
    tagline: 'NGO Digital Platform',
    description:
      'Official web platform for the Arogya Hope Foundation NGO, featuring campaign management, donation workflows, and volunteer coordination.',
    category: 'Full Stack',
    tier: 'B',
    type: 'Web Application',
    technologies: ['TypeScript', 'Next.js', 'CSS', 'Vercel'],
    features: [
      'Campaign showcase',
      'Donation workflows',
      'Volunteer coordination',
      'Responsive design',
    ],
    links: {
      live: 'https://ngo-arogya-hope-foundation.vercel.app',
      github: 'https://github.com/Rahul-2148/NGO-Arogya-Hope-Foundation-',
    },
    color: '#69f0ae',
    year: '2026',
    role: 'Solo Developer',
  },
  {
    slug: 'sahayata-ngo',
    name: 'Sahayata NGO',
    tagline: 'NGO Website v2',
    description:
      'Second iteration of a nonprofit organization website with improved UX and modern architecture.',
    category: 'Full Stack',
    tier: 'B',
    type: 'Web Application',
    technologies: ['TypeScript', 'Next.js', 'CSS'],
    features: [
      'Modern responsive design',
      'Content management',
      'Volunteer portal',
    ],
    links: {
      github: 'https://github.com/Rahul-2148/sahayata_ngo',
    },
    color: '#ffd740',
    year: '2026',
    role: 'Solo Developer',
  },

  /* ─── TIER C: Archive ─── */
  {
    slug: 'django-chatapp',
    name: 'Django ChatApp',
    tagline: 'Real-Time Chat with Django',
    description: 'A real-time chat web application built with Django and WebSockets.',
    category: 'Realtime',
    tier: 'C',
    type: 'Learning Project',
    technologies: ['Python', 'Django', 'WebSockets'],
    features: ['Real-time messaging', 'User authentication'],
    links: {
      github: 'https://github.com/Rahul-2148/Rahul-ChatApp-using-Django',
    },
    color: '#7c4dff',
    year: '2025',
    role: 'Developer',
  },
  {
    slug: 'mandlack-notion',
    name: 'Mandlack Notion',
    tagline: 'Notion-Style UI',
    description: 'A Notion-inspired document editor interface built with TypeScript.',
    category: 'SaaS',
    tier: 'C',
    type: 'UI Project',
    technologies: ['TypeScript', 'React'],
    features: ['Rich text editing', 'Notion-style blocks'],
    links: {
      github: 'https://github.com/Rahul-2148/mandlack-ui-notion',
    },
    color: '#b388ff',
    year: '2025',
    role: 'Developer',
  },
];

/* ============================================
   SKILLS — Organized by Engineering Domain
   ============================================ */
export const skills: Skill[] = [
  // Frontend
  { name: 'Next.js', category: 'Frontend', level: 'core', projects: ['snapcart', 'arogya-hope', 'sahayata-ngo'], description: 'SSR/SSG, App Router, API routes, middleware' },
  { name: 'React', category: 'Frontend', level: 'core', projects: ['zosh-bazaar', 'vybe', 'zaykahub', 'mandlack-notion'], description: 'Component architecture, hooks, context, state management' },
  { name: 'TypeScript', category: 'Frontend', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'zaykahub'], description: 'Strict typing, generics, utility types' },
  { name: 'Vite', category: 'Frontend', level: 'proficient', projects: ['zosh-bazaar', 'zaykahub'], description: 'Build tooling, HMR, plugin system' },
  { name: 'Redux Toolkit', category: 'Frontend', level: 'proficient', projects: ['snapcart'], description: 'Global state management, RTK Query' },
  { name: 'Zustand', category: 'Frontend', level: 'proficient', projects: ['zaykahub'], description: 'Lightweight state management' },

  // Backend
  { name: 'Node.js', category: 'Backend', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub', 'streamify'], description: 'Server architecture, middleware, async patterns' },
  { name: 'Express', category: 'Backend', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub'], description: 'REST API design, middleware chains, error handling' },
  { name: 'Python', category: 'Backend', level: 'proficient', projects: ['snapcart', 'zosh-bazaar', 'django-chatapp'], description: 'ML services, Django, FastAPI' },
  { name: 'Django', category: 'Backend', level: 'familiar', projects: ['django-chatapp'], description: 'MVT architecture, ORM, WebSockets' },

  // Database
  { name: 'MongoDB', category: 'Database', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub'], description: 'Schema design, aggregation, indexing, Atlas' },
  { name: 'Mongoose', category: 'Database', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub'], description: 'ODM, middleware, validation, population' },
  { name: 'Redis', category: 'Database', level: 'proficient', projects: ['snapcart'], description: 'Caching, session store, pub/sub' },

  // Realtime
  { name: 'Socket.IO', category: 'Realtime', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'streamify'], description: 'WebSocket rooms, event-driven architecture' },
  { name: 'WebRTC', category: 'Realtime', level: 'familiar', projects: ['streamify'], description: 'Peer-to-peer video/audio communication' },

  // AI
  { name: 'Gemini', category: 'AI', level: 'familiar', projects: [], description: 'AI model integration, prompt engineering' },
  { name: 'Python ML', category: 'AI', level: 'familiar', projects: ['snapcart', 'zosh-bazaar'], description: 'Recommendation engines, product intelligence' },

  // DevOps
  { name: 'Docker', category: 'DevOps', level: 'proficient', projects: ['snapcart', 'zosh-bazaar'], description: 'Containerization, multi-service orchestration' },
  { name: 'Vercel', category: 'Cloud', level: 'core', projects: ['snapcart', 'vybe', 'zaykahub', 'arogya-hope'], description: 'Deployment, serverless functions, edge' },
  { name: 'Cloudinary', category: 'Cloud', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub'], description: 'Media optimization, CDN, transformations' },
];

/* ============================================
   EXPERIENCE
   ============================================ */
export const experience: Experience[] = [
  {
    company: 'Freelance / Independent',
    role: 'Full-Stack Engineer',
    duration: '2024 – Present',
    description:
      'Building production-grade web applications, from architecture design to deployment. Specializing in full-stack TypeScript platforms with real-time capabilities.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Socket.IO'],
    achievements: [
      'Architected multi-portal e-commerce platform serving 5 distinct user personas',
      'Built real-time delivery tracking systems with Socket.IO and Redis',
      'Integrated dual payment gateways (Stripe + Razorpay) for global reach',
      'Developed Python ML services for product recommendations',
    ],
    current: true,
  },
];

/* ============================================
   ENGINEERING DOMAINS
   ============================================ */
export const engineeringDomains = [
  {
    title: 'Frontend Engineering',
    description: 'Building performant, accessible interfaces with modern rendering strategies.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Vite', 'Redux Toolkit', 'Zustand'],
    highlights: [
      'Server-side rendering & static generation',
      'Component architecture & design systems',
      'State management patterns',
      'Responsive & mobile-first design',
    ],
  },
  {
    title: 'Backend Engineering',
    description: 'Designing scalable APIs with clean architecture and security-first thinking.',
    technologies: ['Node.js', 'Express', 'Python', 'Django', 'FastAPI'],
    highlights: [
      'RESTful API architecture',
      'Authentication & authorization (JWT, RBAC)',
      'Middleware-driven request pipelines',
      'Input validation & sanitization',
    ],
  },
  {
    title: 'Data Engineering',
    description: 'Modeling data for performance, consistency, and query efficiency.',
    technologies: ['MongoDB', 'Mongoose', 'Redis', 'MySQL'],
    highlights: [
      'Document-oriented schema design',
      'Aggregation pipelines & indexing',
      'Caching strategies with Redis',
      'Data modeling for real-time systems',
    ],
  },
  {
    title: 'Real-Time Systems',
    description: 'Building event-driven architectures for live, collaborative experiences.',
    technologies: ['Socket.IO', 'WebRTC', 'WebSockets', 'Redis Pub/Sub'],
    highlights: [
      'WebSocket room management',
      'Event-driven state synchronization',
      'Peer-to-peer video/audio (WebRTC)',
      'Scalable pub/sub patterns',
    ],
  },
  {
    title: 'AI & Automation',
    description: 'Integrating intelligent systems for product recommendations and chat.',
    technologies: ['Gemini', 'Python ML', 'AI Orchestration'],
    highlights: [
      'AI chatbot integration',
      'Product recommendation engines',
      'Provider abstraction for AI models',
      'Knowledge-base retrieval systems',
    ],
  },
];

export const experiences = experience;

