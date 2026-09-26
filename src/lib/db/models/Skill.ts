import mongoose, { Schema, Model, Document } from 'mongoose';
import { Skill } from '@/types';

export interface ISkillDoc extends Omit<Skill, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const SkillSchema = new Schema<ISkillDoc>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true, index: true },
    domain: {
      type: String,
      enum: ['IT', 'Non-IT'],
      default: 'IT',
      index: true,
    },
    category: {
      type: String,
      default: 'Frontend',
      index: true,
    },
    level: {
      type: String,
      enum: ['core', 'proficient', 'familiar'],
      default: 'proficient',
    },
    projects: { type: [String], default: [] },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, default: '#00f0ff' },
    officialUrl: { type: String, default: '' },
    sortOrder: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const SkillModel: Model<ISkillDoc> =
  mongoose.models.Skill || mongoose.model<ISkillDoc>('Skill', SkillSchema);
