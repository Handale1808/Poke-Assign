import mongoose, { Schema, Document } from 'mongoose';

export interface ISynonym extends Document {
  canonical: string;
  variants: string[];
}

const SynonymSchema = new Schema<ISynonym>({
  canonical: { type: String, required: true, unique: true, index: true },
  variants: [String]
});

export default mongoose.models.Synonym || mongoose.model<ISynonym>('Synonym', SynonymSchema);