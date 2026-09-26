import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPresence extends Document {
  visitorId: string;
  lastHeartbeat: Date;
  path: string;
  device: string;
  browser: string;
  referrer: string;
  anonymizedIp: string;
  createdAt: Date;
  updatedAt: Date;
}

const PresenceSchema = new Schema<IPresence>(
  {
    visitorId: { type: String, required: true, unique: true, index: true },
    lastHeartbeat: { type: Date, default: Date.now },
    path: { type: String, default: '/' },
    device: { type: String, default: 'desktop' },
    browser: { type: String, default: 'unknown' },
    referrer: { type: String, default: '' },
    anonymizedIp: { type: String, default: '' },
  },
  { timestamps: true }
);

// Optional TTL index to clean up stale presence after 3 minutes
PresenceSchema.index({ lastHeartbeat: 1 }, { expireAfterSeconds: 180 });

export const PresenceModel: Model<IPresence> =
  mongoose.models.Presence || mongoose.model<IPresence>('Presence', PresenceSchema);
