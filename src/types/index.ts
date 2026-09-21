/* ============================================
   TypeScript Interfaces
   ============================================ */

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tier: 'S' | 'A' | 'B' | 'C';
  type: string;
  technologies: string[];
  features: string[];
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  image?: string;
  color: string;
  year: string;
  role: string;
  isPrivate?: boolean;
  architecture?: ArchitectureNode[];
  challenges?: Challenge[];
  decisions?: TechnicalDecision[];
  metrics?: Metric[];
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

export interface Skill {
  name: string;
  category: SkillCategory;
  level: 'core' | 'proficient' | 'familiar';
  projects: string[];
  description?: string;
}

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Realtime'
  | 'AI'
  | 'DevOps'
  | 'Cloud';

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

export interface PersonalInfo {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  github: string;
  email: string;
  location: string;
  available: boolean;
  resumeUrl?: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
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
