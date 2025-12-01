// src/app/components/SynonymBuilder.tsx

'use client';

import { useState, useEffect } from 'react';
import { extractMeaningfulWords, deduplicateWords, buildEnrichedText } from '../utils/textProcessing';
import { fetchAllSynonyms } from '../utils/synonymApi';
import { EnrichedAnalysisInput } from '../types/analysis';

interface SynonymBuilderProps {
  inputText: string;
  onComplete: (enrichedData: EnrichedAnalysisInput) => void;
  onCancel: () => void;
}

type Status = 'processing' | 'complete' | 'error';

export default function SynonymBuilder({ inputText, onComplete, onCancel }: SynonymBuilderProps) {
  const [status, setStatus] = useState<Status>('processing');
  const [meaningfulWords, setMeaningfulWords] = useState<string[]>([]);
  const [synonymMap, setSynonymMap] = useState<{ [word: string]: string[] }>({});
  const [currentlyProcessing, setCurrentlyProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    processText();
  }, []);

  const processText = async () => {
    try {
      const words = extractMeaningfulWords(inputText);
      const uniqueWords = deduplicateWords(words);

      if (uniqueWords.length === 0) {
        setError('We need more specific words to analyze. Please try adding more descriptive terms.');
        setStatus('error');
        return;
      }

      setMeaningfulWords(uniqueWords);

      const fetchedSynonyms = await fetchAllSynonyms(uniqueWords);
      setSynonymMap(fetchedSynonyms);
      setStatus('complete');
    } catch (err) {
      console.error('Error processing text:', err);
      setError('Something went wrong while building your synonym profile. Please try again.');
      setStatus('error');
    }
  };

  const handleContinue = () => {
    const enrichedText = buildEnrichedText(inputText, meaningfulWords, synonymMap);
    
    const enrichedData: EnrichedAnalysisInput = {
      originalText: inputText,
      meaningfulWords,
      synonymMap,
      enrichedText
    };

    onComplete(enrichedData);
  };

  return (
    <div className="mt-8 animate-slide-up">
      <div className="bg-[#1a1a2e] rounded-lg p-6 md:p-8 gradient-border">
        <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-6">
          Building Your Synonym Profile...
        </h2>

        {status === 'error' ? (
          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-red-400">
              {error}
            </div>
            <button
              onClick={onCancel}
              className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              {meaningfulWords.map((word, index) => (
                <div
                  key={word}
                  className="bg-slate-900 rounded-lg p-4 border border-slate-800"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-200 capitalize">{word}</span>
                        {status === 'complete' && synonymMap[word] && (
                          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {status === 'processing' && (
                          <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        )}
                      </div>
                      {synonymMap[word] && synonymMap[word].length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {synonymMap[word].map(synonym => (
                            <span
                              key={synonym}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 text-sm rounded border border-purple-500/30"
                            >
                              {synonym}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleContinue}
                disabled={status !== 'complete'}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Continue to Analysis
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}