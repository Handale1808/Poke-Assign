import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  inputText: string;
  source: string;
  correlationId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  inputText: { type: String, required: true },
  source: { type: String, default: 'web' },
  correlationId: { type: String, required: true, index: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'],
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);