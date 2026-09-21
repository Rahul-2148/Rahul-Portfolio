import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IVisitor extends Document {
  visitorId: string;
  type: 'guest' | 'user';
  userId?: mongoose.Types.ObjectId;
  viewsCount: number;
  lastVisitedAt: Date;
  lastPath: string;
  userAgent?: string;
  ip?: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>(
  {
    visitorId: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['guest', 'user'], default: 'guest' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    viewsCount: { type: Number, default: 1 },
    lastVisitedAt: { type: Date, default: Date.now },
    lastPath: { type: String, default: '/' },
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    referrer: { type: String, default: '' },
  },
  { timestamps: true }
);

export const VisitorModel: Model<IVisitor> =
  mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);

export interface IDailyAnalytics extends Document {
  date: string; // YYYY-MM-DD
  totalViews: number;
  guestViews: number;
  userViews: number;
  uniqueGuests: string[];
  uniqueUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DailyAnalyticsSchema = new Schema<IDailyAnalytics>(
  {
    date: { type: String, required: true, unique: true, index: true },
    totalViews: { type: Number, default: 0 },
    guestViews: { type: Number, default: 0 },
    userViews: { type: Number, default: 0 },
    uniqueGuests: { type: [String], default: [] },
    uniqueUsers: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const DailyAnalyticsModel: Model<IDailyAnalytics> =
  mongoose.models.DailyAnalytics || mongoose.model<IDailyAnalytics>('DailyAnalytics', DailyAnalyticsSchema);
