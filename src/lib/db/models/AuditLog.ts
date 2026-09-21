import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  resource: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true },
    details: { type: Schema.Types.Mixed, default: () => ({}) },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const AuditLogModel: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
