import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  correlationId: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  meta?: any;
  createdAt: Date;
}

const LogSchema = new Schema<ILog>({
  correlationId: { type: String, required: true, index: true },
  level: { 
    type: String, 
    enum: ['info', 'warn', 'error', 'debug'],
    required: true 
  },
  message: { type: String, required: true },
  meta: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
});

export default mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);