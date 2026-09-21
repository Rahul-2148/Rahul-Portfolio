import mongoose, { Schema, Model } from 'mongoose';
import { PortfolioData } from '@/types';

const PersonalInfoSchema = new Schema(
  {
    name: { type: String, default: 'Rahul Raj' },
    role: { type: String, default: 'Full-Stack Engineer' },
    tagline: { type: String, default: 'AI × Product × Real-Time Systems' },
    bio: { type: String, default: '' },
    github: { type: String, default: 'https://github.com/Rahul-2148' },
    email: { type: String, default: 'rahulraj2148@gmail.com' },
    location: { type: String, default: 'India' },
    available: { type: Boolean, default: true },
    resumeUrl: { type: String, default: '' },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: 'Full Stack' },
    tier: { type: String, enum: ['S', 'A', 'B', 'C'], default: 'A' },
    type: { type: String, default: 'Web Application' },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    links: {
      live: { type: String, default: '' },
      github: { type: String, default: '' },
      caseStudy: { type: String, default: '' },
    },
    image: { type: String, default: '' },
    color: { type: String, default: '#00f0ff' },
    year: { type: String, default: '2025' },
    role: { type: String, default: 'Lead Engineer' },
    isPrivate: { type: Boolean, default: false },
    architecture: { type: Array, default: [] },
    challenges: { type: Array, default: [] },
    decisions: { type: Array, default: [] },
    metrics: { type: Array, default: [] },
  },
  { _id: false }
);

const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    current: { type: Boolean, default: false },
  },
  { _id: false }
);

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, default: '' },
    duration: { type: String, default: '' },
    score: { type: String, default: '' },
    location: { type: String, default: '' },
    achievements: { type: [String], default: [] },
  },
  { _id: false }
);

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'Frontend' },
    level: { type: String, enum: ['core', 'proficient', 'familiar'], default: 'proficient' },
    projects: { type: [String], default: [] },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const SecuritySchema = new Schema(
  {
    customPasscode: { type: String, default: '' },
    adminEmail: { type: String, default: 'rahulraj2148@gmail.com' },
    otp: {
      code: { type: String, default: '' },
      expiresAt: { type: Date, default: null },
      lastRequestedAt: { type: Date, default: null },
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

export interface IPortfolioDoc extends mongoose.Document, PortfolioData {
  docId: string;
  security?: {
    customPasscode?: string;
    adminEmail?: string;
    otp?: {
      code?: string;
      expiresAt?: Date | null;
      lastRequestedAt?: Date | null;
    };
    updatedAt?: Date;
  };
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolioDoc>(
  {
    docId: { type: String, unique: true, default: 'main' },
    personalInfo: { type: PersonalInfoSchema, default: () => ({}) },
    projects: { type: [ProjectSchema], default: [] },
    experiences: { type: [ExperienceSchema], default: [] },
    educations: { type: [EducationSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
    security: { type: SecuritySchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const PortfolioModel: Model<IPortfolioDoc> =
  mongoose.models.Portfolio || mongoose.model<IPortfolioDoc>('Portfolio', PortfolioSchema);
