# Rahul Raj — Enterprise Full-Stack Engineering Platform

> Next-Gen Developer Portfolio, Distributed Systems Architecture Blueprint & Production CMS Control Studio

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Cloud_Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![OpenAPI 3.0](https://img.shields.io/badge/OpenAPI_3.0-Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:3000/docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

---

**[Explore Live Demo](http://localhost:3000)** • **[Interactive Swagger API Docs](http://localhost:3000/docs)** • **[Admin Studio](http://localhost:3000/admin)** • **[Download ATS Resume](http://localhost:3000/resume)**

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [System Architecture & Data Flow](#system-architecture--data-flow)
- [Swagger & OpenAPI 3.0 API Documentation](#swagger--openapi-30-api-documentation)
- [Flagship Engineering Systems](#flagship-engineering-systems)
- [Tech Stack & Engineering Arsenal](#tech-stack--engineering-arsenal)
- [Project Directory Structure](#project-directory-structure)
- [Quick Start & Local Setup](#quick-start--local-setup)
- [Environment Variables Reference](#environment-variables-reference)
- [Security Architecture & Hardening](#security-architecture--hardening)
  - [Hardware Biometrics & WebAuthn Passkeys](#hardware-biometric--webauthn-passkey-authentication-fingerprint--touchid--windows-hello)
- [Production Deployment](#production-deployment)
- [Contributing & Standards](#contributing--standards)
- [License](#license)
- [Contact & Connect](#contact--connect)

---

## Executive Summary

An industry-grade, high-performance web platform engineered by **Rahul Raj Modi** (Full-Stack Engineer & Systems Architect). Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, this application serves as both a high-conversion developer showcase and a real-world enterprise engineering laboratory.

Key engineering highlights:

- **Zero-Flicker Dynamic Portfolio Engine**: Real-time CMS for managing projects, skills, education, experience, achievements, and resumes without code redeployment.
- **Embedded Developer CLI Terminal (`~` or `Ctrl+\``)**: Full Unix-like terminal emulator with 20+ commands, Web Audio synthesizer sound effects, matrix mode, Neofetch system overview, and command history.
- **On-Demand Lazy Overlay Architecture**: Next.js code-splitting optimization that defers heavy overlays (Terminal, Resume Modal, Command Palette) completely out of the critical rendering path until explicitly invoked.
- **Interactive Swagger & OpenAPI 3.0 Documentation**: Full interactive API explorer hosted natively at `/docs` with live request sandbox.
- **Multi-Provider Cascading AI Copilot**: Context-aware executive AI assistant with automated model fallback (**Gemini 2.5 Flash** to **Groq Llama 3.3 70B** to **OpenAI** to **Local Cognitive Engine**) and zero-leak privacy protection.
- **Biometric Passkey & Hardware WebAuthn Authentication**: FIDO2-compliant biometric fingerprint and facial recognition unlocking (`Windows Hello`, `TouchID`, `FaceID`, Android Biometrics) for instant, passwordless access to `/admin`, backed by a 4-Digit Security PIN and 6-digit Email OTP recovery.
- **Stealth Owner Access Triggers**: Zero UI footprint for public visitors — owner access triggered via global hotkey (`Ctrl+Shift+A` / `Cmd+Shift+A`), Brand "R" logo triple-tap on mobile/desktop, or CLI terminal command.
- **Visitor Pass & Recruiter Lead Capture**: Interactive registration modal linking verified recruiter credentials to real-time session telemetry.
- **Direct Cloudinary Media Pipeline**: Secure authenticated media uploads and bulk asset deletion with automatic format transcoding and responsive delivery.
- **Real-Time Telemetry & Presence Pulse**: Anonymous visitor session tracking, geographic insights, and sub-second live activity counters.
- **Enterprise Security Posture**: Sliding window IP rate limiters, anti-bot honeypot traps, cryptographic HMAC-SHA256 session cookies, and security audit logs.

---

## System Architecture & Data Flow

```text
                                  +------------------------------------+
                                  |        Client Micro-Frontends      |
                                  | (Desktop, Mobile, Tablet Viewports)|
                                  +-----------------+------------------+
                                                    |
                                             HTTPS / WSS
                                                    |
                                                    v
                                  +------------------------------------+
                                  |    Edge Gateway & Security Layer   |
                                  |  - Sliding Window IP Rate Limiter  |
                                  |  - Invisible Honeypot Spam Filter  |
                                  |  - HMAC Session / Cookie Verifier  |
                                  +-----------------+------------------+
                                                    |
                                                    v
                       +-------------------------------------------------------------+
                       |           Next.js 16 App Router & Server Handlers           |
                       |  - Server Components (SSR / Static Cache Revalidation)      |
                       |  - RESTful Route Handlers (/api/portfolio, /api/contact...) |
                       |  - Interactive Swagger UI Viewer (/docs & /api/docs)        |
                       +-------+--------------------+---------------------+----------+
                               |                    |                     |
                               v                    v                     v
                 +--------------------+   +-------------------+  +-------------------+
                 | MongoDB Atlas DB   |   | Cloudinary Engine |  | AI Copilot Router |
                 | - Portfolio Config |   | - Resumes (PDF)   |  | 1. Gemini Flash   |
                 | - Projects & Skills|   | - Profile Avatars |  | 2. Groq Llama 70B |
                 | - Recruiter Inbox  |   | - Project Mockups |  | 3. Local Engine   |
                 | - Audit & Presence |   | - Dynamic CDNs    |  | (Zero Prompt Leak)|
                 +--------------------+   +-------------------+  +-------------------+
                               |                                          |
                               +--------------------+---------------------+
                                                    |
                                                    v
                                  +------------------------------------+
                                  |    Notification & Event Dispatch   |
                                  |  - Nodemailer SMTP Real-Time Alert |
                                  |  - Background Telemetry Logging    |
                                  +------------------------------------+
```

---

## Swagger & OpenAPI 3.0 API Documentation

The platform features native, comprehensive **OpenAPI 3.0.3** documentation with an embedded **Swagger UI** explorer.

- **Interactive Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs) (or `/api-docs`)
- **Raw OpenAPI JSON Spec**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs) (or `/openapi.json`)

### API Endpoints Reference Matrix

| Category | Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| **System** | `GET` | `/api/health` | None | Service diagnostics, MongoDB Atlas latency, memory usage & uptime |
| **Portfolio** | `GET` | `/api/portfolio` | None | Complete portfolio dataset (bio, projects, skills, education, experience) |
| **Portfolio** | `GET` | `/api/resumes` | None | Published downloadable resumes with ATS metadata & PDF URLs |
| **Visitor Pass** | `POST` | `/api/visitor/auth` | None | Issue Recruiter or Visitor Pass and upgrade session to verified lead |
| **Contact** | `POST` | `/api/contact` | None (Rate Limited) | Submit recruiter inquiry with Zod validation & email notification |
| **AI Assistant** | `POST` | `/api/chat` | None | Interactive conversational copilot with multi-LLM cascade |
| **Telemetry** | `POST` | `/api/analytics/track` | None | Ingest privacy-preserving user action & pageview events |
| **Telemetry** | `POST` | `/api/analytics/presence` | None | Active visitor heartbeat ping for live activity counters |
| **Admin Auth** | `POST` | `/api/admin/auth` | Passcode / OTP | Admin login, session cookie generation, OTP dispatch & recovery |
| **Admin Auth** | `GET` | `/api/admin/auth` | Session | Check current admin authentication status |
| **Admin CMS** | `GET / POST` | `/api/admin/portfolio` | Admin Auth | Master portfolio document sync, section updates & initial seeding |
| **Admin Projects** | `GET` | `/api/admin/projects` | Admin Auth | List all projects with status filtering & counts |
| **Admin Projects** | `POST` | `/api/admin/projects` | Admin Auth | Create a new portfolio project |
| **Admin Projects** | `PUT` | `/api/admin/projects/{id}` | Admin Auth | Update project details, architecture nodes, or case study |
| **Admin Projects** | `DELETE` | `/api/admin/projects/{id}` | Admin Auth | Delete project |
| **Admin Projects** | `POST` | `/api/admin/projects/reorder` | Admin Auth | Bulk update display ordering of projects |
| **Admin CMS** | `GET / POST` | `/api/admin/skills` | Admin Auth | Technical & operational skills inventory management |
| **Admin CMS** | `GET / POST` | `/api/admin/educations` | Admin Auth | Academic degrees, coursework & certifications |
| **Admin CMS** | `GET / POST` | `/api/admin/achievements` | Admin Auth | Hackathon awards, honors & verified badges |
| **Admin CMS** | `GET / POST` | `/api/admin/resumes` | Admin Auth | Resume PDF catalog & primary active switch |
| **Admin Settings** | `GET / POST` | `/api/admin/settings` | Admin Auth | Profile details, headline, bio, contact email & avatar DP |
| **Admin Media** | `POST` | `/api/admin/cloudinary/upload` | Admin Auth | Direct authenticated media upload to Cloudinary CDN |
| **Admin Media** | `POST` | `/api/admin/cloudinary/delete` | Admin Auth | Delete single or bulk media assets from Cloudinary CDN |
| **Admin Media** | `GET` | `/api/admin/cloudinary/status` | Admin Auth | Cloudinary configuration & connection telemetry |
| **Admin Inbox** | `GET` | `/api/admin/messages` | Admin Auth | Recruiter contact message inbox with status filters |
| **Admin Inbox** | `PUT` | `/api/admin/messages/{id}` | Admin Auth | Update message status (`unread`, `read`, `archived`) |
| **Admin Analytics** | `GET` | `/api/admin/analytics` | Admin Auth | Aggregated visitor volume, device breakdowns & top pages |
| **Admin Telemetry** | `GET` | `/api/admin/analytics/realtime` | Admin Auth | Live presence pulse & active user session log |
| **Admin Security** | `GET` | `/api/admin/audit-logs` | Admin Auth | Chronological security audit trail of admin mutations |

### Quick curl Examples

#### 1. System Health Check

```bash
curl -X GET http://localhost:3000/api/health
```

#### 2. Query Public Portfolio

```bash
curl -X GET http://localhost:3000/api/portfolio
```

#### 3. Send Recruiter Inquiry (Contact Form)

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Connor",
    "email": "sarah@techcorp.io",
    "subject": "Senior Full-Stack Engineer Opportunity",
    "message": "Hi Rahul, we were impressed by your distributed systems work on Zosh Bazaar and Snapcart.",
    "company": "TechCorp",
    "projectType": "Full-Time",
    "budget": "$110,000 - $140,000"
  }'
```

#### 4. Query AI Assistant Copilot

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain the 5 micro-frontends of Zosh Bazaar and how Socket.IO room namespaces work."
  }'
```

#### 5. Authenticate Admin via Passcode

```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "passcode": "your_secure_admin_passcode_here"
  }' \
  -c cookies.txt
```

#### 6. Issue Recruiter / Visitor Pass

```bash
curl -X POST http://localhost:3000/api/visitor/auth \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Connor",
    "email": "sarah@techcorp.io",
    "company": "TechCorp Systems",
    "role": "Lead Technical Recruiter",
    "purpose": "hiring"
  }'
```

---

## Flagship Engineering Systems

The portfolio acts as an interactive technical case study for production applications architected by Rahul Raj:

### 1. Zosh Bazaar — Enterprise Multi-Vendor E-Commerce

- **Architecture**: 5 decoupled micro-frontends: Customer Storefront, Merchant Console, Admin Tower, Logistics Control Tower, and Delivery Partner App.
- **Real-Time Communication**: Node.js & Express gateway coordinating all 5 portals via scoped **Socket.IO room namespaces** (`seller_{id}`, `order_{id}`) with `< 50ms` latency.
- **Fintech**: Razorpay payment integration with cryptographic **HMAC-SHA256 webhook validation** and automated multi-vendor commission ledgers.
- **Repository**: [https://github.com/Rahul-2148/Zosh-Bazaar-Multivendor-Ecommerce](https://github.com/Rahul-2148/Zosh-Bazaar-Multivendor-Ecommerce)

### 2. Snapcart — 10-Minute Rapid Grocery Delivery

- **Architecture**: Next.js App Router, TypeScript, MongoDB Atlas, Redis, Socket.IO, Stripe, Razorpay, Python, and Docker.
- **Performance**: In-memory **Redis caching** for catalog reads and user sessions; live driver GPS streaming via WebSockets.
- **Fintech & AI**: Dual payment gateway routing (Stripe for international, Razorpay for domestic) + standalone Python microservice for cart co-occurrence recommendations.
- **Live Demo**: [https://snapcart-psi.vercel.app](https://snapcart-psi.vercel.app)

### 3. ClassyShop — Enterprise E-Commerce Platform

- **Stack**: React 19, Material UI, Tailwind CSS v4, Express 5, Node.js, MongoDB, Razorpay, PayPal.
- **Features**: Three-tier decoupled architecture, dual domestic/international payments, automated dynamic PDF invoice generation, and Excel monthly ledger analytics export.
- **Repository**: [https://github.com/Rahul-2148/E-commerce-2k25_Final](https://github.com/Rahul-2148/E-commerce-2k25_Final)

### 4. VYBE — High-Scale Social Media Platform

- **Stack**: React, Node.js, Express, MongoDB, Socket.IO, Cloudinary CDN.
- **Features**: Reels video playback engine, 24-hour disappearing stories lifecycle, live direct messaging, and automated media optimization.
- **Live Demo**: [https://vybe-rust-eight.vercel.app](https://vybe-rust-eight.vercel.app)

---

## Tech Stack & Engineering Arsenal

| Layer | Technologies | Key Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19 | Server Components, streaming SSR, zero-layout-shift navigation |
| **Language** | TypeScript 5 (Strict Mode) | Zero `any` policy, unified type contracts across client & API |
| **Styling & Design** | Tailwind CSS v4, Vanilla CSS | Next-gen lightning-fast CSS engine with zero runtime overhead |
| **Animation & UX** | GSAP 3, Framer Motion, Lenis Smooth Scroll | 60 FPS hardware-accelerated micro-interactions and smooth momentum scrolling |
| **Primary Database** | MongoDB Atlas, Mongoose 9 ODM | Scalable document modeling with compound indexing and connection pooling |
| **Caching & Pub/Sub** | Redis / In-Memory Cache | Sub-millisecond reads for high-frequency catalog & session queries |
| **API Documentation** | OpenAPI 3.0.3, Swagger UI | Industry-standard interactive documentation and schema contracts |
| **Cloud Media Storage** | Cloudinary CDN | Secure direct uploads, dynamic on-the-fly transformations, PDF hosting |
| **Transactional Email** | Nodemailer (Gmail / SMTP / Dev Mock) | Background non-blocking email dispatch for inquiries and OTP security |
| **AI LLM Orchestration** | Gemini 2.5 Flash, Groq Llama 3.3 70B, OpenAI | Multi-model fallback cascade with strict privacy isolation |
| **Validation & Security** | Zod 4, Crypto HMAC-SHA256, Sliding Window Limiter | Strict payload parsing, anti-spoofing webhooks, anti-bot honeypots |
| **Tooling & Linter** | Oxlint (Rust-based), ESLint 9 | Sub-second codebase linting and formatting verification |

---

## Project Directory Structure

```text
rahul-portfolio/
├── public/                       # Static public assets
│   ├── assets/                   # Profile photos, brand icons, illustrations
│   ├── resumes/                  # Fallback offline PDF resumes
│   └── openapi.json              # Static OpenAPI 3.0.3 specification export
├── src/
│   ├── app/                      # Next.js 16 App Router hierarchy
│   │   ├── layout.tsx            # Global HTML shell, fonts, telemetry providers
│   │   ├── page.tsx              # Home / Interactive Hero & System Showcase
│   │   ├── about/page.tsx        # Engineering philosophy & background
│   │   ├── work/                 # Project showcases & case studies
│   │   │   ├── page.tsx          # Filterable project index (Tier, Tech, Category)
│   │   │   └── [slug]/page.tsx   # Detailed deep-dive architectural case study
│   │   ├── experience/page.tsx   # Career timeline & technical achievements
│   │   ├── education/page.tsx    # Academic credentials, coursework & degrees
│   │   ├── resume/page.tsx       # Live interactive resume viewer & ATS PDF export
│   │   ├── contact/page.tsx      # Recruiter contact form with rate-limiting
│   │   ├── docs/page.tsx         # Interactive Swagger UI Documentation page
│   │   ├── api-docs/page.tsx     # Redirect helper for Swagger docs
│   │   ├── admin/page.tsx        # Authenticated Admin Control Studio CMS
│   │   └── api/                  # 26+ Production RESTful Route Handlers
│   │       ├── health/           # Diagnostic health probes
│   │       ├── portfolio/        # Public portfolio data aggregator
│   │       ├── resumes/          # Active resume list endpoint
│   │       ├── contact/          # Inbound message receiver & email dispatcher
│   │       ├── chat/             # Cascading AI copilot engine
│   │       ├── analytics/        # Presence heartbeat & visitor telemetry
│   │       ├── docs/             # Dynamic OpenAPI 3.0 JSON specification endpoint
│   │       └── admin/            # Secure CMS management endpoints (RBAC)
│   ├── components/               # Modular, reusable UI components
│   │   ├── layout/               # Navbar, Footer, Mobile Navigation Bar
│   │   ├── sections/             # Hero, SelectedWork, ArchitectureVisualizer...
│   │   ├── ui/                   # Buttons, Badges, Modals, Tabs, Drawers
│   │   └── admin/                # Admin CMS form modules, media dropzones
│   ├── lib/                      # Core business logic & integrations
│   │   ├── auth/                 # Admin session tokens & cryptographic verification
│   │   ├── db/                   # MongoDB connection singleton & Mongoose models
│   │   ├── docs/                 # OpenAPI specification schemas
│   │   ├── email/                # Nodemailer configuration & template engine
│   │   ├── cloudinary.ts         # Direct Cloudinary media integration
│   │   ├── env.ts                # Validated environment configuration accessor
│   │   └── server/rateLimiter.ts # In-memory sliding window IP rate limiter
│   ├── styles/
│   │   └── globals.css           # Global Tailwind CSS directives & scroll utilities
│   └── types/                    # Shared TypeScript interfaces & domain models
├── .env.example                  # Exhaustive environment variable template
├── .markdownlint.json            # Markdown lint rules configuration
├── LICENSE                       # MIT License (Rahul Raj Modi)
├── package.json                  # Dependencies & execution scripts
├── README.md                     # Project documentation (You are here)
└── tsconfig.json                 # Strict TypeScript configuration
```

---

## Quick Start & Local Setup

### Prerequisites

- **Node.js**: `v18.17.0` or later (`v20.x` recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Database**: Free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI (optional: runs resiliently even before DB setup)

### 1. Clone Repository

```bash
git clone https://github.com/Rahul-2148/Rahul-Portfolio.git
cd Rahul-Portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create your local `.env.local` file by copying the provided template:

```bash
cp .env.example .env.local
```

*(Review the [Environment Variables](#environment-variables-reference) section below for key descriptions).*

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Portfolio: `http://localhost:3000`
- Swagger API Docs: `http://localhost:3000/docs`
- Admin Control Studio: `http://localhost:3000/admin` (Default development passcode: `rahul2148` or whatever is configured in `.env.local`)

### 5. Validate Code Quality & Linting

```bash
# Rust-accelerated ultra-fast linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Verify production build compilation
npm run build
```

---

## Environment Variables Reference

| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Optional | `development` | Runtime environment (`development` \| `production`) |
| `PORT` | Optional | `3000` | Port for local Next.js server |
| `NEXT_PUBLIC_SITE_URL` | Optional | `http://localhost:3000` | Canonical domain URL for SEO & OpenGraph |
| `MONGODB_URI` | **Recommended** | `mongodb+srv://user:pass@cluster...` | MongoDB Atlas database connection URI |
| `ADMIN_PASSCODE` | **Recommended** | `your_secure_passcode_here` | Master passcode to access `/admin` Control Studio |
| `ADMIN_EMAIL` | Optional | `rahulraj21480@gmail.com` | Target email for contact form alerts & password OTPs |
| `SMTP_HOST` | Optional | `smtp.gmail.com` | SMTP email server host |
| `SMTP_PORT` | Optional | `465` | SMTP port (465 for SSL, 587 for TLS) |
| `SMTP_USER` | Optional | `rahulraj21480@gmail.com` | SMTP username / Gmail address |
| `SMTP_PASS` | Optional | `app_password_here` | SMTP password / Gmail App Password (runs in simulation mode if empty) |
| `SMTP_FROM` | Optional | `"Rahul Raj Portfolio" <email>` | Display sender name and email in delivered alerts |
| `CLOUDINARY_CLOUD_NAME` | Optional | `your_cloud_name` | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | Optional | `1234567890` | Cloudinary API Key for media uploads |
| `CLOUDINARY_API_SECRET` | Optional | `secret_key_here` | Cloudinary API Secret for signature generation |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` | Google Gemini API Key for AI Assistant copilot |
| `GEMINI_MODEL` | Optional | `gemini-2.5-flash` | Gemini preferred model (`gemini-2.5-flash`, `2.0-flash`) |
| `GROQ_API_KEY` | Optional | `gsk_...` | Groq Cloud API Key for ultra-fast LPU inference |
| `GROQ_MODEL` | Optional | `llama-3.3-70b-versatile` | Preferred Groq model (`llama-3.3-70b-versatile`) |
| `OPENAI_API_KEY` | Optional | `sk-...` | OpenAI API Key (optional third-tier fallback) |

---

## Security Architecture & Hardening

1. **Role-Based Access Control (RBAC)**:
   - Admin routes are protected through cryptographic HMAC tokens (`portfolio_admin_token` cookie) or the `x-admin-passcode` request header.
   - Zero hardcoded passwords; passwords can be updated dynamically in MongoDB Atlas with Email OTP verification.

2. **Anti-Bot Honeypot Defense**:
   - The public contact form embeds hidden honeypot fields (`website`, `honeypot`). Automated bots that fill these fields are silently intercepted with a spoofed 200 OK response without consuming email or database resources.

3. **Sliding-Window IP Rate Limiting**:
   - Contact submissions are throttled at 5 requests per 15 minutes per hashed IP address to prevent spam floods.

4. **Zero-Prompt-Leak Directives**:
   - The AI assistant copilot is fortified with strict guardrail prompt injections, preventing disclosure of backend models, private system configurations, or developer variables.

5. **Security Audit Logging**:
   - All mutations in the admin studio (creating projects, editing profile settings, deleting assets) are automatically logged in the `AuditLog` collection with timestamp and actor metadata.

### Hardware Biometric & WebAuthn Passkey Authentication (Fingerprint / TouchID / Windows Hello)

The `/admin` Control Studio incorporates enterprise-grade biometric authentication powered by the native **W3C Web Authentication API (WebAuthn)** and **FIDO2** public-key cryptography:

1. **One-Tap Biometric Authentication**:
   - **Hardware Sensors**: On supported devices (Windows Hello Fingerprint / Facial Recognition, MacBook TouchID, iPhone FaceID, or Android Biometric Prompt), authentication interfaces directly with the device's hardware Secure Enclave / TPM chip.
   - **Zero Password Transmission**: Biometric data never leaves the device. Authentication uses cryptographic challenge-response signatures verified by the server, eliminating credential theft, keylogging, and man-in-the-middle attacks.

2. **Multi-Tiered Access & Fallback Hierarchy**:
   - **Tier 1 (Biometric Passkey)**: Direct 1-tap hardware sensor verification (`navigator.credentials.get` / `navigator.credentials.create`).
   - **Tier 2 (4-Digit Security PIN)**: High-speed PIN entry with auto-focus sequential digit boxes and invalid attempt shake micro-animations.
   - **Tier 3 (Master Passcode)**: Fallback to the environment-configured master passcode (`ADMIN_PASSCODE`).
   - **Tier 4 (6-Digit Email OTP Recovery)**: Automated SMTP email dispatch with single-use verification codes for self-service passcode and PIN resets.

3. **Stealth Owner Access Triggers (Zero Public Footprint)**:
   To preserve the portfolio's minimalist recruiter-facing presentation, all visible public admin buttons are omitted from the main user navigation:
   - **Global Hotkey**: Press **`Ctrl + Shift + A`** (or **`Cmd + Shift + A`** on macOS) anywhere on the website to jump directly into the Admin Studio.
   - **"R" Logo Triple-Tap**: Rapidly tapping/clicking the Brand "R" logo 3 times within 800ms routes straight to `/admin` on mobile devices and desktop browsers.
   - **CLI Terminal**: Type `admin` in the Developer Terminal (`~`) to launch the control studio.

---

## Production Deployment

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub: `git push origin main`.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Set your Environment Variables in the Vercel Project Settings (specifically `MONGODB_URI`, `ADMIN_PASSCODE`, `ADMIN_EMAIL`, `CLOUDINARY_*`, and `GEMINI_API_KEY`).
4. Click **Deploy**. Vercel will build the Next.js production bundle with automated Edge optimization.

### Deploying with Docker

```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Contributing & Standards

Contributions and suggestions are warmly welcomed! Please adhere to the following workflow:

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch**:

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Your Changes**:

   ```bash
   git commit -m "feat: implement high-performance event caching"
   ```

4. **Verify Standards**:

   ```bash
   npm run lint
   ```

5. **Push to Your Branch**:

   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for full legal text and permissions.

```text
Copyright (c) 2026 Rahul Raj Modi (Rahul-2148)
```

---

## Contact & Connect

**Rahul Raj Modi**  
*Full-Stack Engineer & Systems Architect*  
*Specializing in Next.js, MERN, Distributed Systems & Real-Time Architectures*

- **Email**: [rahulraj21480@gmail.com](mailto:rahulraj21480@gmail.com)
- **GitHub**: [@Rahul-2148](https://github.com/Rahul-2148)
- **LinkedIn**: [linkedin.com/in/rahulraj2148](https://linkedin.com/in/rahulraj2148)
- **Portfolio**: [http://localhost:3000](http://localhost:3000)
- **API Documentation**: [http://localhost:3000/docs](http://localhost:3000/docs)

---

*Engineered with precision, clean architecture principles, and passion by Rahul Raj Modi.*
