// src/app/components/ResultCard.tsx

'use client';

import { useState, useEffect } from 'react';
import EvidencePanel from './EvidencePanel';

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

interface ResultCardProps {
  analysis: AnalysisResult;
  onReset: () => void;
}

export default function ResultCard({ analysis, onReset }: ResultCardProps) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [feralWidth, setFeralWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeralWidth((analysis.finalResult.feralRating / 10) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [analysis.finalResult.feralRating]);

  const getRiskLevelStyles = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getFeralGradient = () => {
    const rating = analysis.finalResult.feralRating;
    if (rating <= 3) return 'from-green-500 to-green-400';
    if (rating <= 6) return 'from-yellow-500 to-yellow-400';
    if (rating <= 8) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className="mt-8 animate-slide-up">
      <div className="bg-[#1a1a2e] rounded-lg p-6 md:p-8 gradient-border">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            {analysis.finalResult.gremlinType}
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Feral Rating</span>
              <span className="text-slate-300 font-bold">
                {analysis.finalResult.feralRating.toFixed(1)} / 10
              </span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getFeralGradient()} transition-all duration-1000 ease-out`}
                style={{ width: `${feralWidth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskLevelStyles(
                analysis.finalResult.riskLevel
              )}`}
            >
              {analysis.finalResult.riskLevel.toUpperCase()} RISK
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-slate-200">Containment Protocol</h3>
            </div>
            <p className="text-slate-300">{analysis.finalResult.recommendedContainment}</p>
          </div>

          <div>
            <p className="text-sm text-slate-400 italic">{analysis.finalResult.notes}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Your Pokemon Matches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.topMatches.slice(0, 3).map((match) => (
              <div
                key={match.pokeapiId}
                className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={match.sprite}
                    alt={match.name}
                    className="w-24 h-24 mb-2"
                  />
                  <h4 className="text-lg font-semibold text-slate-200 capitalize mb-2">
                    {match.name}
                  </h4>
                  <div className="w-full">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Similarity</span>
                      <span className="text-cyan-400 font-semibold">
                        {(match.similarity * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-1000"
                        style={{ width: `${match.similarity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-lg font-semibold transition-all hover:scale-105 active:scale-98"
          >
            Try Another
          </button>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors border border-slate-700"
          >
            {showEvidence ? 'Hide' : 'View'} Evidence
          </button>
        </div>

        <EvidencePanel
          analysis={analysis}
          isExpanded={showEvidence}
          onToggle={() => setShowEvidence(!showEvidence)}
        />
      </div>
    </div>
  );
}