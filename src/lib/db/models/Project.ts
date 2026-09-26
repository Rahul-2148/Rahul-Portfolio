import mongoose, { Schema, Model, Document } from 'mongoose';
import { Project } from '@/types';

export interface IProjectDoc extends Omit<Project, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const ProjectSchema = new Schema<IProjectDoc>(
  {
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    category: {
      type: String,
      default: 'Full Stack',
      index: true,
    },
    tier: {
      type: String,
      enum: ['S', 'A', 'B', 'C'],
      default: 'A',
      index: true,
    },
    type: { type: String, default: 'Web Application' },
    vendorModel: { type: String, default: '' },
    portalsCount: { type: Number, default: 0 },
    portalsList: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    links: {
      live: { type: String, default: '' },
      github: { type: String, default: '' },
      caseStudy: { type: String, default: '' },
    },
    image: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    heroImage: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    color: { type: String, default: '#00f0ff' },
    year: { type: String, default: '2025' },
    role: { type: String, default: 'Lead Engineer' },
    isPrivate: { type: Boolean, default: false },
    architecture: { type: Array, default: [] },
    challenges: { type: Array, default: [] },
    decisions: { type: Array, default: [] },
    metrics: { type: Array, default: [] },
    caseStudyContent: {
      overview: { type: String, default: '' },
      problem: { type: String, default: '' },
      goals: { type: [String], default: [] },
      solutions: { type: String, default: '' },
      lessonsLearned: { type: [String], default: [] },
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    stats: {
      views: { type: Number, default: 0 },
      uniqueVisitors: { type: Number, default: 0 },
      liveClicks: { type: Number, default: 0 },
      githubClicks: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Compound indexes for fast queries
ProjectSchema.index({ status: 1, sortOrder: 1 });
ProjectSchema.index({ status: 1, featured: 1, sortOrder: 1 });

export const ProjectModel: Model<IProjectDoc> =
  mongoose.models.Project || mongoose.model<IProjectDoc>('Project', ProjectSchema);
