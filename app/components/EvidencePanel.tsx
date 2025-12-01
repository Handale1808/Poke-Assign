// src/app/components/EvidencePanel.tsx

'use client';

import { useState } from 'react';

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

interface EvidencePanelProps {
  analysis: AnalysisResult;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function EvidencePanel({ analysis, isExpanded, onToggle }: EvidencePanelProps) {
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCorrelationId = async () => {
    try {
      await navigator.clipboard.writeText(analysis.correlationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-6 border-t border-slate-700">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-cyan-400 transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-medium text-slate-400">
          For Scientists (and boring people)
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="pb-4 space-y-6 animate-slide-up">
          <div className="bg-slate-950 rounded-lg p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Top Matches</h3>
              <div className="space-y-3">
                {analysis.topMatches.map((match, index) => (
                  <div key={match.pokeapiId} className="border-l-2 border-purple-500 pl-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                          <span className="font-medium text-slate-200 capitalize">{match.name}</span>
                          <span className="text-xs text-cyan-400">
                            {(match.similarity * 100).toFixed(1)}% match
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 italic mb-2">
                          "{match.matchedSnippet}"
                        </p>
                        <a
                          href={match.pokeapiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300 underline"
                        >
                          View on PokeAPI
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Correlation ID</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-slate-900 px-3 py-2 rounded border border-slate-800 text-slate-400">
                  {analysis.correlationId}
                </code>
                <button
                  onClick={handleCopyCorrelationId}
                  className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Provenance</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Embedding Provider:</span>
                  <p className="text-slate-300">{analysis.provenance.embeddingProvider}</p>
                </div>
                <div>
                  <span className="text-slate-500">LLM Provider:</span>
                  <p className="text-slate-300">{analysis.provenance.llmProvider}</p>
                </div>
                <div>
                  <span className="text-slate-500">LLM Model:</span>
                  <p className="text-slate-300">{analysis.provenance.llmModel}</p>
                </div>
                <div>
                  <span className="text-slate-500">Timestamp:</span>
                  <p className="text-slate-300">
                    {new Date(analysis.provenance.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-xs text-slate-400 hover:text-slate-300 underline mb-2"
              >
                {showRawJson ? 'Hide' : 'Show'} Raw JSON
              </button>
              {showRawJson && (
                <pre className="text-xs bg-slate-900 p-3 rounded border border-slate-800 overflow-x-auto text-slate-300">
                  {analysis.llmRawOutput}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}