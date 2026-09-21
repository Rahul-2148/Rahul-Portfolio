import mongoose, { Schema, Model, Document } from 'mongoose';

export type AnalyticsEventType =
  | 'page_view'
  | 'session_start'
  | 'project_view'
  | 'live_demo_click'
  | 'github_click'
  | 'resume_download'
  | 'contact_open'
  | 'contact_submit';

export interface IAnalyticsEvent extends Document {
  eventType: AnalyticsEventType;
  visitorId: string;
  sessionId?: string;
  path: string;
  projectSlug?: string;
  referrer?: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  country?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    visitorId: { type: String, required: true, index: true },
    sessionId: { type: String, index: true },
    path: { type: String, default: '/' },
    projectSlug: { type: String, index: true, default: '' },
    referrer: { type: String, default: '' },
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: 'desktop',
      index: true,
    },
    browser: { type: String, default: 'unknown' },
    os: { type: String, default: 'unknown' },
    country: { type: String, default: 'Unknown' },
    metadata: { type: Schema.Types.Mixed, default: () => ({}) },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsEventSchema.index({ projectSlug: 1, eventType: 1 });

export const AnalyticsEventModel: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
