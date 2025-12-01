// src/app/types/analysis.ts

export interface TopMatch {
  pokeapiId: number;
  name: string;
  similarity: number;
  matchedSnippet: string;
  pokeapiUrl: string;
  sprite: string;
}

export interface Provenance {
  embeddingProvider: string;
  llmProvider: string;
  llmModel: string;
  timestamp: string;
}

export interface AnalysisResult {
  id: string;
  correlationId: string;
  finalResult: {
    gremlinType: string;
    feralRating: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    recommendedContainment: string;
    notes: string;
  };
  topMatches: TopMatch[];
  llmRawOutput: string;
  provenance: Provenance;
}

export interface EnrichedAnalysisInput {
  originalText: string;
  meaningfulWords: string[];
  synonymMap: { [word: string]: string[] };
  enrichedText: string;
}