import mongoose, { Schema, Document, Types } from 'mongoose';

interface ITopMatch {
  pokeapiId: number;
  name: string;
  similarity: number;
  matchedSnippet: string;
  pokeapiUrl: string;
}

interface IProvenance {
  embeddingProvider: string;
  llmProvider: string;
  llmModel: string;
  timestamp: Date;
}

export interface IAnalysis extends Document {
  submissionId: Types.ObjectId;
  correlationId: string;
  topMatches: ITopMatch[];
  finalResult: {
    gremlinType: string;
    feralRating: number;
    riskLevel: string;
    recommendedContainment: string;
    notes: string;
  };
  llmRawOutput: string;
  provenance: IProvenance;
  vectorScores: number[];
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>({
  submissionId: { type: Schema.Types.ObjectId, ref: 'Submission', required: true },
  correlationId: { type: String, required: true, index: true },
  topMatches: [{
    pokeapiId: Number,
    name: String,
    similarity: Number,
    matchedSnippet: String,
    pokeapiUrl: String
  }],
  finalResult: {
    gremlinType: String,
    feralRating: Number,
    riskLevel: String,
    recommendedContainment: String,
    notes: String
  },
  llmRawOutput: { type: String, required: true },
  provenance: {
    embeddingProvider: String,
    llmProvider: String,
    llmModel: String,
    timestamp: Date
  },
  vectorScores: [Number],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);