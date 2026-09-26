import { Project, Skill, Experience, NavItem, Education, Achievement, ResumeItem } from '@/types';

/* ============================================
   NAVIGATION
   ============================================ */
export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Engineering', href: '/engineering' },
  { label: 'Experience', href: '/experience' },
  { label: 'Education', href: '/education' },
  { label: 'AI Lab', href: '/ai-lab' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

/* ============================================
   PERSONAL INFO
   ============================================ */
export const personalInfo = {
  name: 'Rahul Raj',
  role: 'Full-Stack Developer',
  tagline: 'MERN Stack • Full-Stack • AI Engineer',
  bio: 'I build high-performance web applications, scalable real-time systems, and intelligent digital products.',
  github: 'https://github.com/Rahul-2148',
  linkedin: 'https://linkedin.com/in/rahulraj2148',
  twitter: 'https://x.com/rahulraj2148',
  instagram: 'https://instagram.com/rahulraj2148',
  leetcode: 'https://leetcode.com/u/rahulraj2148',
  codeforces: 'https://codeforces.com/profile/rahulraj2148',
  email: 'rahulraj21480@gmail.com',
  location: 'India',
  available: true,
  dateOfBirth: '2003',
  education: 'Computer Science & Engineering',
  // User can specify custom Cloudinary URL or local assets path
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || '/assets/rahul.jpg',
};

/* ============================================
   PROJECTS — Curated from GitHub Analysis
   ============================================ */
export const projects: Project[] = [
  /* ─── TIER S: Flagships ─── */
  {
    slug: 'zosh-bazaar',
    name: 'Zosh Bazaar',
    tagline: 'Multi-Vendor B2B2C Marketplace Ecosystem (5 Portals)',
    description:
      'A true multi-vendor e-commerce marketplace powered by 5 decoupled micro-frontends (Customer Storefront, Merchant/Seller Console, Platform Super-Admin, Logistics Hub, and Delivery Rider App). Built for multi-tenant merchant onboarding, commission routing, live WebSocket tracking, and AI-assisted shopping.',
    category: 'E-commerce',
    tier: 'S',
    type: 'Multi-Vendor Marketplace (5 Portals)',
    vendorModel: 'Multi-Vendor Marketplace',
    portalsCount: 5,
    portalsList: [
      'Customer Storefront',
      'Merchant / Seller Console',
      'Platform Super-Admin',
      'Logistics Tower Hub',
      'Delivery Rider App',
    ],
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
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1200&auto=format&fit=crop',
    ],
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
    slug: 'classyshop',
    name: 'ClassyShop',
    tagline: 'Single-Vendor Direct D2C Store (Storefront + Store Admin)',
    description:
      'A dedicated single-vendor direct-to-consumer (D2C) brand store. Features a three-tier decoupled architecture: modern React 19 customer storefront, centralized store owner administrative control panel with Recharts financial analytics & automated PDF/Excel invoicing, and an Express 5 REST API with dual Razorpay & PayPal checkout.',
    category: 'E-commerce',
    tier: 'S',
    type: 'Single-Vendor D2C Brand Store',
    vendorModel: 'Single-Vendor Direct',
    portalsCount: 2,
    portalsList: ['Customer Storefront', 'Store Owner Admin Control Panel'],
    technologies: [
      'React',
      'Material UI',
      'Tailwind CSS',
      'Vite',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'Razorpay',
      'Cloudinary',
      'Firebase',
      'JWT',
    ],
    features: [
      'Three-tier decoupled architecture: Customer Storefront, Admin Control Panel, and Express 5 REST API',
      'Responsive customer storefront built with React 19, Material UI (MUI), and Tailwind CSS v4',
      'Dual payment integration: Razorpay (UPI, Cards, Netbanking) & PayPal Checkout SDK',
      'Comprehensive Admin management portal with MUI, Recharts financial analytics, and stock management',
      'Automated invoice & document generation with jsPDF, html2canvas, docx, and XLSX Excel export',
      'Interactive product experience with react-inner-image-zoom, dynamic price sliders, and customer reviews',
      'Secure stateless JWT authentication with HTTP-only cookies, Helmet security headers, and RBAC',
      'Cloudinary media pipeline for dynamic image optimization, banners, and product uploads',
    ],
    links: {
      github: 'https://github.com/Rahul-2148/E-commerce-2k25_Final',
    },
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    ],
    color: '#007FFF',
    year: '2025',
    role: 'Full-Stack Architect & Solo Developer',
    architecture: [
      {
        id: 'client',
        label: 'Customer Storefront',
        type: 'client',
        description: 'React 19 + MUI + Tailwind v4 customer application with cart and checkout.',
        technology: 'React 19 + MUI + Vite',
        x: 25,
        y: 10,
        connections: ['api'],
      },
      {
        id: 'admin',
        label: 'Admin Control Panel',
        type: 'client',
        description: 'Enterprise dashboard for analytics, inventory, and automated invoice export.',
        technology: 'React 19 + MUI + Recharts',
        x: 75,
        y: 10,
        connections: ['api'],
      },
      {
        id: 'api',
        label: 'Express 5 REST API',
        type: 'server',
        description: 'Scalable backend API with JWT authentication, RBAC, and compression.',
        technology: 'Node.js + Express 5',
        x: 50,
        y: 40,
        connections: ['mongodb', 'cloudinary', 'payment'],
      },
      {
        id: 'mongodb',
        label: 'MongoDB Cluster',
        type: 'database',
        description: 'NoSQL document database for catalogs, orders, and user accounts.',
        technology: 'MongoDB + Mongoose 8',
        x: 25,
        y: 75,
        connections: [],
      },
      {
        id: 'payment',
        label: 'Dual Payment Engine',
        type: 'service',
        description: 'Razorpay UPI & Cards plus PayPal Checkout Server SDK integration.',
        technology: 'Razorpay + PayPal SDK',
        x: 50,
        y: 75,
        connections: [],
      },
      {
        id: 'cloudinary',
        label: 'Cloudinary Media CDN',
        type: 'service',
        description: 'Cloud storage and optimization for product images and banners.',
        technology: 'Cloudinary SDK',
        x: 75,
        y: 75,
        connections: [],
      },
    ],
    challenges: [
      {
        title: 'Three-Tier Decoupled Architecture',
        problem: 'Managing independent customer storefront, admin dashboard, and REST API without monolithic coupling.',
        solution:
          'Structured the project into distinct client, admin, and server workspaces powered by Vite and Express 5 with automated linting and code validation.',
        impact: 'Independent development and deployment cycles with isolated security boundaries.',
      },
      {
        title: 'Dual Payment Orchestration (Razorpay & PayPal)',
        problem: 'Seamlessly accepting both domestic Indian payments (UPI, Netbanking) and international transactions.',
        solution:
          'Integrated both Razorpay API and PayPal Checkout Server SDK with server-side signature verification and order capture routines.',
        impact: 'Flexible and secure checkout experiences for diverse customer demographics.',
      },
    ],
  },
  {
    slug: 'snapcart',
    name: 'Snapcart',
    tagline: '10-Minute Rapid Grocery Delivery (Dark Store Hub + ML)',
    description:
      'A high-velocity quick-commerce grocery delivery platform operating on a direct-to-consumer dark store inventory model. Features Next.js SSR/SSG storefront, Redis caching layer, sub-second Socket.IO live rider GPS tracking, and a Python ML collaborative recommendation engine.',
    category: 'E-commerce',
    tier: 'S',
    type: 'Quick-Commerce Dark Store Hub',
    vendorModel: 'Quick-Commerce Hub',
    portalsCount: 2,
    portalsList: ['Customer App', 'Dark Store Dispatch Hub'],
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
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1200&auto=format&fit=crop',
    ],
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
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=1200&auto=format&fit=crop',
    ],
    color: '#e040fb',
    year: '2026',
    role: 'Solo Full-Stack Engineer',
  },
  {
    slug: 'zaykahub',
    name: 'ZaykaHub',
    tagline: 'Direct Restaurant Food Ordering & Kitchen Portal',
    description:
      'A full-stack on-demand food delivery platform connecting customers directly to restaurant ordering and kitchen administration. Features dynamic menu search, interactive cart customization, dual payment checkout (Stripe + Razorpay), and restaurant order queue dispatch.',
    category: 'E-commerce',
    tier: 'A',
    type: 'On-Demand Food Delivery Platform',
    vendorModel: 'On-Demand Service',
    portalsCount: 2,
    portalsList: ['Customer Food Ordering App', 'Restaurant Manager Dashboard'],
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
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    ],
    color: '#ff6d00',
    year: '2026',
    role: 'Solo Full-Stack Engineer',
  },
  /* ─── TIER B: Supporting ─── */
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
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    ],
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
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200&auto=format&fit=crop',
    ],
    color: '#ffd740',
    year: '2026',
    role: 'Solo Developer',
  },

  /* ─── TIER C: Archive ─── */
  {
    slug: 'streamify',
    name: 'Streamify',
    tagline: 'Video Calling Web Application',
    description:
      'A real-time video calling platform with WebRTC-based communication, supporting group calls and screen sharing.',
    category: 'Realtime',
    tier: 'C',
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
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
    ],
    color: '#448aff',
    year: '2025',
    role: 'Solo Developer',
  },
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
  { name: 'Next.js', category: 'Frontend', level: 'core', projects: ['snapcart', 'arogya-hope', 'sahayata-ngo'], description: 'SSR/SSG, App Router, Server Actions, Middleware, Edge Runtime' },
  { name: 'React', category: 'Frontend', level: 'core', projects: ['zosh-bazaar', 'vybe', 'zaykahub', 'classyshop', 'mandlack-notion'], description: 'Component architecture, custom hooks, context, state management' },
  { name: 'TypeScript', category: 'Frontend', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'zaykahub'], description: 'Strict type safety, generics, interfaces, modular design' },
  { name: 'JavaScript', category: 'Frontend', level: 'core', projects: ['vybe', 'streamify'], description: 'ES6+ modern syntax, asynchronous patterns, event loop' },
  { name: 'Vite', category: 'Frontend', level: 'proficient', projects: ['zosh-bazaar', 'zaykahub', 'classyshop'], description: 'Ultra-fast HMR, Rollup build pipeline, modern frontend bundling' },
  { name: 'Tailwind CSS', category: 'Frontend', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'classyshop'], description: 'Utility-first styling, responsive design systems, CSS animations' },
  { name: 'Redux Toolkit', category: 'Frontend', level: 'proficient', projects: ['snapcart'], description: 'Predictable global state management, RTK Query caching' },
  { name: 'Zustand', category: 'Frontend', level: 'proficient', projects: ['zaykahub'], description: 'Atomic, lightweight state management with zero boilerplate' },
  { name: 'shadcn/ui', domain: 'IT', category: 'Frontend', level: 'core', projects: ['snapcart', 'zosh-bazaar'], description: 'Accessible Radix UI primitives, copy-paste architecture, Tailwind CSS styled components & theme variables' },
  { name: 'Material UI', domain: 'IT', category: 'Frontend', level: 'proficient', projects: ['classyshop', 'mandlack-notion'], description: 'Google Material Design system, emotion styled components, enterprise UI data grids & theme palettes' },
  { name: 'Bootstrap', domain: 'IT', category: 'Frontend', level: 'proficient', projects: ['sahayata-ngo'], description: '12-column responsive flexbox grid, prebuilt utility classes, modal dialogs & cross-browser UI components' },

  // Backend
  { name: 'Node.js', category: 'Backend', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub', 'classyshop', 'streamify'], description: 'Event-driven server runtime, async I/O pipelines, microservices' },
  { name: 'Express', category: 'Backend', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub', 'classyshop'], description: 'RESTful API architecture, middleware routing, RBAC security' },
  { name: 'C++', domain: 'IT', category: 'Backend', level: 'core', projects: [], description: 'Object-oriented systems programming, STL data structures, memory management, pointers & high-performance DSA' },
  { name: 'Python', category: 'Backend', level: 'proficient', projects: ['snapcart', 'zosh-bazaar', 'django-chatapp'], description: 'Fast scripting, AI/ML recommendation engines, backend microservices' },
  { name: 'FastAPI', category: 'Backend', level: 'proficient', projects: ['snapcart'], description: 'High-performance async Python APIs with Pydantic validation' },
  { name: 'Flask', domain: 'IT', category: 'Backend', level: 'proficient', projects: [], description: 'Lightweight Python WSGI micro-framework, modular blueprints, RESTful APIs & Jinja2 templating' },
  { name: 'Django', category: 'Backend', level: 'familiar', projects: ['django-chatapp'], description: 'MVT web framework, ORM models, channels for WebSockets' },

  // Database
  { name: 'MongoDB', category: 'Database', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub', 'classyshop'], description: 'NoSQL document schema design, aggregation pipelines, Atlas cluster' },
  { name: 'Mongoose', category: 'Database', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub', 'classyshop'], description: 'ODM schema modeling, pre/post middleware hooks, data validation' },
  { name: 'PostgreSQL', category: 'Database', level: 'proficient', projects: [], description: 'Relational data modeling, SQL queries, ACID compliance, indexing' },
  { name: 'Redis', category: 'Database', level: 'proficient', projects: ['snapcart'], description: 'In-memory caching, pub/sub channels, rate-limiting, session store' },

  // Realtime
  { name: 'Socket.IO', category: 'Realtime', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'streamify'], description: 'Bi-directional WebSocket rooms, real-time live tracking and notifications' },
  { name: 'WebRTC', category: 'Realtime', level: 'familiar', projects: ['streamify'], description: 'Peer-to-peer audio/video streaming, ICE/STUN signaling' },

  // Cloud & Deployment
  { name: 'AWS', category: 'Cloud', level: 'familiar', projects: [], description: 'S3 cloud object storage, EC2 compute instances, IAM security policies' },
  { name: 'Microsoft Azure', category: 'Cloud', level: 'familiar', projects: [], description: 'Azure App Services, Blob Storage, Virtual Machines, Azure DevOps & Entra ID' },
  { name: 'Vercel', category: 'Cloud', level: 'core', projects: ['snapcart', 'vybe', 'zaykahub', 'arogya-hope'], description: 'Continuous deployment, serverless edge functions, DNS configuration' },
  { name: 'Cloudinary', category: 'Cloud', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe', 'zaykahub', 'classyshop'], description: 'Cloud media pipeline, dynamic image optimization, video delivery CDN' },

  // DevOps
  { name: 'Docker', category: 'DevOps', level: 'proficient', projects: ['snapcart', 'zosh-bazaar'], description: 'Containerization, Dockerfile multi-stage builds, docker-compose orchestration' },
  { name: 'Git', category: 'DevOps', level: 'core', projects: ['zosh-bazaar', 'snapcart', 'vybe'], description: 'Version control workflows, branching strategy, commit history management' },
  { name: 'GitHub', category: 'DevOps', level: 'core', projects: ['zosh-bazaar', 'snapcart', 'vybe'], description: 'CI/CD automation, GitHub Actions, repository management, releases' },

  // AI & Agentic Coding
  { name: 'Google Antigravity', domain: 'IT', category: 'AI', level: 'core', projects: [], description: 'Google DeepMind agentic coding platform, autonomous multi-step execution, proactive code synthesis & deep tool/MCP integration' },
  { name: 'Windsurf', domain: 'IT', category: 'AI', level: 'core', projects: [], description: 'Agentic AI IDE by Codeium, Cascade flow, deep codebase vector indexing & synchronized multi-file editing' },
  { name: 'Devin AI', domain: 'IT', category: 'AI', level: 'proficient', projects: [], description: 'Cognition AI autonomous software engineer, end-to-end task execution, sandbox debugging & automated PR delivery' },
  { name: 'Claude', category: 'AI', level: 'core', projects: [], description: 'Anthropic Claude Fable 5.1 & Opus 5.5, Claude Code CLI, long-horizon agentic workflows' },
  { name: 'DeepSeek', category: 'AI', level: 'proficient', projects: [], description: 'DeepSeek-V4.1-Flash, DeepSeek-V4 MoE & R1 reasoning models, local/cloud inference' },
  { name: 'Gemini', category: 'AI', level: 'core', projects: ['zosh-bazaar'], description: 'Google Gemini 3.8 Flash, 3.8 Live & 3.1 Pro multimodal models, agentic execution' },
  { name: 'Grok', category: 'AI', level: 'core', projects: [], description: 'xAI Grok 4.6 frontier reasoning models, Colossus cluster training, real-time knowledge synthesis' },
  { name: 'Groq', category: 'AI', level: 'core', projects: [], description: 'Groq LPU hardware acceleration, 500+ T/s ultra-fast LLM inference, Whisper audio processing' },
  { name: 'Python ML', category: 'AI', level: 'familiar', projects: ['snapcart', 'zosh-bazaar'], description: 'Content-based and collaborative filtering for recommendation engines' },

  // Tools & Security (IT Domain)
  { name: 'Razorpay', category: 'Tools', level: 'core', projects: ['zosh-bazaar', 'snapcart', 'zaykahub', 'classyshop'], description: 'Secure checkout integration, order generation, webhook signature verification' },
  { name: 'Stripe', category: 'Tools', level: 'proficient', projects: ['snapcart', 'zaykahub'], description: 'International payment processing, checkout sessions, customer billing' },
  { name: 'JWT', category: 'Tools', level: 'core', projects: ['zosh-bazaar', 'snapcart', 'zaykahub', 'classyshop'], description: 'JSON Web Token stateless auth, refresh tokens, role-based authorization' },
  { name: 'VS Code', domain: 'IT', category: 'Tools', level: 'core', projects: [], description: 'Integrated development environment, debugging workflows, Git source control, extensions & performance profiling' },

  // Design & UI/UX (IT Domain)
  { name: 'UI/UX Design', domain: 'IT', category: 'Design', level: 'core', projects: ['snapcart', 'zosh-bazaar', 'vybe'], description: 'Figma wireframing, design systems thinking, accessibility (WCAG AA), responsive micro-interactions' },

  // Non-IT: BPO & Customer Operations
  { name: 'Flipkart Smart Assist CRM', domain: 'Non-IT', category: 'BPO & Operations', level: 'core', projects: [], description: 'Hands-on Flipkart process operations, incident triage, customer ticket lifecycle management & escalation resolution' },
  { name: 'BPO & Customer Operations', domain: 'Non-IT', category: 'BPO & Operations', level: 'core', projects: [], description: 'Inbound/outbound process management, customer grievance resolution, SLA tracking & QA monitoring' },

  // Non-IT: Office Productivity & Business Analytics
  { name: 'Microsoft Excel', domain: 'Non-IT', category: 'Office & Analytics', level: 'core', projects: [], description: 'Advanced formulas, VLOOKUP/XLOOKUP, Pivot Tables, MIS reporting, operational dashboards & data reconciliation' },
  { name: 'Power BI', domain: 'Non-IT', category: 'Office & Analytics', level: 'proficient', projects: [], description: 'Interactive business dashboards, KPI visualization, incident resolution trends & operational reporting' },
  { name: 'MS Office Suite', domain: 'Non-IT', category: 'Office & Analytics', level: 'core', projects: [], description: 'PowerPoint executive presentations, Word documentation, SOP authoring & stakeholder communication' },

  // Non-IT: Creative & Media
  { name: 'Video Editing', domain: 'Non-IT', category: 'Creative & Media', level: 'proficient', projects: [], description: 'Timeline sequencing, video pacing, B-roll integration, audio syncing, color correction & content production' },

  // Non-IT: Core / Manufacturing & Supply Chain
  { name: 'Supply Chain & Logistics', domain: 'Non-IT', category: 'Supply Chain', level: 'core', projects: [], description: 'E-commerce order dispatch, reverse logistics, warehouse handover, delivery tracking & vendor coordination' },
  { name: 'Quality Control & Six Sigma', domain: 'Non-IT', category: 'Manufacturing', level: 'proficient', projects: [], description: 'Standard Operating Procedures (SOPs), quality inspection, defect minimization & process compliance' },

  // Non-IT: Managerial & Operations
  { name: 'Team Leadership & Operations', domain: 'Non-IT', category: 'Management', level: 'core', projects: [], description: 'Shift scheduling, cross-functional workforce leadership, performance KPIs & training mentorship' },
  { name: 'Process Optimization', domain: 'Non-IT', category: 'Management', level: 'core', projects: [], description: 'Workflow bottleneck analysis, standard operational procedures (SOPs), cost reduction & productivity scaling' },
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
    description: 'Integrating intelligent systems for product recommendations, agentic engineering, and chat.',
    technologies: ['Google Antigravity', 'Windsurf', 'Devin AI', 'Claude', 'DeepSeek', 'Gemini', 'Grok', 'Groq', 'Python ML', 'AI Orchestration'],
    highlights: [
      'Google Antigravity & Windsurf agentic IDE environments for autonomous coding workflows',
      'Cognition Devin autonomous software engineering & sandbox testing',
      'Claude Code CLI, Claude Fable 5.1 & Opus 5.5 long-horizon agentic workflows',
      'xAI Grok 4.6 frontier reasoning models & real-time knowledge synthesis',
      'DeepSeek-R1 deep reasoning & DeepSeek-V4.1-Flash MoE high-throughput inference',
      'Groq LPU hardware acceleration for 500+ tokens/sec streaming & Whisper speech pipelines',
      'Gemini 3.8 Flash & 3.8 Live multimodal integration with real-time grounding',
      'Provider abstraction for resilient multi-LLM orchestration',
    ],
  },
];

export const experiences = experience;

/* ============================================
   EDUCATION (Populated via Admin Panel)
   ============================================ */
export const educations: Education[] = [];

/* ============================================
   ACHIEVEMENTS & CERTIFICATIONS (Populated via Admin Panel)
   ============================================ */
export const achievements: Achievement[] = [];

/* ============================================
   CURATED MULTI-RESUMES (Populated via Admin Panel)
   ============================================ */
export const resumes: ResumeItem[] = [];



