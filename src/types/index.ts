/* ============================================
   TypeScript Interfaces
   ============================================ */

export interface Project {
  _id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tier: 'S' | 'A' | 'B' | 'C';
  type: string;
  vendorModel?: VendorModel | string;
  portalsCount?: number;
  portalsList?: string[];
  status?: 'published' | 'draft' | 'archived';
  featured?: boolean;
  sortOrder?: number;
  technologies: string[];
  features: string[];
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  image?: string;
  gallery?: string[];
  heroImage?: string;
  videoUrl?: string;
  color: string;
  year: string;
  role: string;
  isPrivate?: boolean;
  architecture?: ArchitectureNode[];
  challenges?: Challenge[];
  decisions?: TechnicalDecision[];
  metrics?: Metric[];
  caseStudyContent?: {
    overview?: string;
    problem?: string;
    goals?: string[];
    solutions?: string;
    lessonsLearned?: string[];
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  stats?: {
    views?: number;
    uniqueVisitors?: number;
    liveClicks?: number;
    githubClicks?: number;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type ProjectCategory =
  | 'Full Stack'
  | 'Backend'
  | 'AI'
  | 'Realtime'
  | 'E-commerce'
  | 'SaaS'
  | 'Social'
  | 'Automation'
  | 'Experimental';

export type VendorModel =
  | 'Multi-Vendor Marketplace'
  | 'Single-Vendor Direct'
  | 'Quick-Commerce Hub'
  | 'On-Demand Service'
  | 'Social Network'
  | 'SaaS Platform';

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'client' | 'server' | 'database' | 'service' | 'external';
  description: string;
  technology: string;
  x: number;
  y: number;
  connections: string[];
}

export interface Challenge {
  title: string;
  problem: string;
  solution: string;
  impact: string;
}

export interface TechnicalDecision {
  problem: string;
  options: string[];
  decision: string;
  tradeoff: string;
  result: string;
}

export interface Metric {
  label: string;
  value: string;
  description?: string;
}

export type SkillDomain = 'IT' | 'Non-IT';

export interface Skill {
  _id?: string;
  name: string;
  slug?: string;
  domain?: SkillDomain;
  techType?: string;
  category: SkillCategory | string;
  level: 'core' | 'proficient' | 'familiar';
  projects?: string[];
  description?: string;
  icon?: string;
  color?: string;
  officialUrl?: string;
  sortOrder?: number;
  active?: boolean;
}

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Realtime'
  | 'AI'
  | 'DevOps'
  | 'Cloud'
  | 'Tools'
  | 'Design'
  | 'BPO & Operations'
  | 'Office & Analytics'
  | 'Creative & Media'
  | 'Supply Chain'
  | 'Manufacturing'
  | 'Management';

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies: string[];
  achievements: string[];
  current?: boolean;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field?: string;
  duration: string;
  score?: string;
  location?: string;
  achievements?: string[];
}

export interface ResumeItem {
  id: string;
  title: string;
  category: string;
  url: string;
  publicId?: string;
  fileSize?: string;
  format?: string;
  isPrimary?: boolean;
  uploadedAt?: string | Date;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'certification' | 'award' | 'hackathon' | 'milestone';
  credentialUrl?: string;
  url?: string;
  description?: string;
  skills?: string[];
}

export interface PersonalInfo {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  github: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  leetcode?: string;
  codeforces?: string;
  email: string;
  location: string;
  available: boolean;
  resumeUrl?: string;
  dateOfBirth?: string;
  education?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  resumes?: ResumeItem[];
  achievements?: Achievement[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: string;
  action: () => void;
  category: string;
}
