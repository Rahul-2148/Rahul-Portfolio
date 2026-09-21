import mongoose, { Schema, Model, Document } from 'mongoose';

export type ContactMessageStatus = 'unread' | 'read' | 'replied' | 'archived';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  projectType?: string;
  budget?: string;
  status: ContactMessageStatus;
  ipHash?: string;
  sourceUrl?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    company: { type: String, trim: true, maxlength: 120, default: '' },
    projectType: { type: String, trim: true, maxlength: 80, default: '' },
    budget: { type: String, trim: true, maxlength: 80, default: '' },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'archived'],
      default: 'unread',
      index: true,
    },
    ipHash: { type: String, default: '' },
    sourceUrl: { type: String, default: '/contact' },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

// High-efficiency compound indexes for Admin querying and sorting
ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ status: 1, createdAt: -1 });
ContactMessageSchema.index({ email: 1 });

export const ContactMessageModel: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
