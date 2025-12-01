// src/app/components/SubmissionForm.tsx

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

interface SubmissionFormProps {
  onAnalysisComplete: (analysis: AnalysisResult) => void;
}

const EXAMPLE_TEXTS = [
  "I stay up way too late scrolling memes and eating chips in bed",
  "I impulse buy plants then forget to water them for weeks",
  "I start 10 projects and finish none but I'm very enthusiastic about all of them"
];

export default function SubmissionForm({ onAnalysisComplete }: SubmissionFormProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = inputText.length;

  const handleExampleClick = (exampleText: string) => {
    setInputText(exampleText);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (charCount < 10) {
      setError('Please write at least 10 characters about your vibes');
      return;
    }

    if (charCount > 1000) {
      setError('Whoa there, keep it under 1000 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }

      if (data.success && data.analysis) {
        onAnalysisComplete(data.analysis);
        setInputText('');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          setError("Couldn't reach the gremlin summoner. Check your connection.");
        } else {
          setError(err.message || 'Something went wrong. Try again or contact support.');
        }
      } else {
        setError('Something went wrong. Try again or contact support.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe your vibes, habits, or chaotic tendencies..."
          className={`w-full min-h-[120px] px-4 py-3 bg-[var(--colour-bg-card)] border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[var(--colour-pastel-lavender)] text-[var(--colour-text)] placeholder-[var(--colour-text)] transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          } ${error ? 'border-red-500' : 'border-[var(--colour-border)]'}`}
          disabled={isLoading}
          rows={4}
        />
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-sm ${
              charCount > 1000
                ? 'text-red-400'
                : charCount > 900
                ? 'text-yellow-400'
                : 'text-[var(--colour-text)]'
            }`}
          >
            {charCount} / 1000
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <p className="text-sm text-[var(--colour-text)] mb-2">Need inspiration? Try an example:</p>
        <div className="flex flex-col sm:flex-row gap-2">
          {EXAMPLE_TEXTS.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm bg-[var(--colour-bg-card)] hover:bg-[var(--colour-hover)] border border-[var(--colour-border)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              Example {index + 1}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || charCount < 10 || charCount > 1000}
        className="w-full px-8 py-4 gradient-purple-cyan hover:from-purple-500 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-98 disabled:scale-100 disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>SUMMONING...</span>
          </>
        ) : (
          <span className="text-black">SUMMON MY GREMLIN</span>
        )}
      </button>
    </form>
  );
}