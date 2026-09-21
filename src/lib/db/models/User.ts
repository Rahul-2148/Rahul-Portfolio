import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  company: string;
  role: string;
  purpose: 'hiring' | 'freelance' | 'networking' | 'viewing';
  notes?: string;
  loginCount: number;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    company: { type: String, default: 'Independent', trim: true },
    role: { type: String, default: 'Recruiter / Client', trim: true },
    purpose: {
      type: String,
      enum: ['hiring', 'freelance', 'networking', 'viewing'],
      default: 'hiring',
    },
    notes: { type: String, default: '' },
    loginCount: { type: Number, default: 1 },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
