// src/app/page.tsx

'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import SubmissionForm from './components/SubmissionForm';
import ResultCard from './components/ResultCard';

interface TopMatch {
  pokeapiId: number;
  name: string;
  similarity: number;
  matchedSnippet: string;
  pokeapiUrl: string;
  sprite: string;
}

interface Provenance {
  embeddingProvider: string;
  llmProvider: string;
  llmModel: string;
  timestamp: string;
}

interface AnalysisResult {
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

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalysisComplete = (analysis: AnalysisResult) => {
    setCurrentAnalysis(analysis);
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen px-4 sm:px-8 md:px-12 py-8">
      <div className="max-w-4xl mx-auto">
        <Hero />
        
        {!currentAnalysis && (
          <div className="mt-8">
            <SubmissionForm onAnalysisComplete={handleAnalysisComplete} />
          </div>
        )}

        {currentAnalysis && (
          <ResultCard analysis={currentAnalysis} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}