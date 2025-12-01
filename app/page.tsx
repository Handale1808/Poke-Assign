// src/app/page.tsx

"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import SubmissionForm from "./components/SubmissionForm";
import ResultCard from "./components/ResultCard";
import { AnalysisResult, EnrichedAnalysisInput } from "./types/analysis";
import SynonymBuilder from "./components/SynonymBuilder";

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

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(
    null
  );
  const [showSynonymBuilder, setShowSynonymBuilder] = useState(false);
  const [pendingInputText, setPendingInputText] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleFormSubmit = (inputText: string) => {
    setPendingInputText(inputText);
    setShowSynonymBuilder(true);
    setAnalysisError(null);
  };

  const handleSynonymComplete = async (enrichedData: EnrichedAnalysisInput) => {
    setShowSynonymBuilder(false);
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrichedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      if (data.success && data.analysis) {
        setCurrentAnalysis(data.analysis);
        setPendingInputText(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("fetch")) {
          setAnalysisError(
            "Couldn't reach the gremlin summoner. Check your connection."
          );
        } else {
          setAnalysisError(err.message || "Something went wrong. Try again.");
        }
      } else {
        setAnalysisError("Something went wrong. Try again.");
      }
      setShowSynonymBuilder(false);
      setPendingInputText(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSynonymCancel = () => {
    setShowSynonymBuilder(false);
    setPendingInputText(null);
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    setAnalysisError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen px-4 sm:px-8 md:px-12 py-8">
      <div className="max-w-4xl mx-auto">
        <Hero />

        {!currentAnalysis && !showSynonymBuilder && !isAnalyzing && (
          <div className="mt-8">
            <SubmissionForm onSubmit={handleFormSubmit} />
            {analysisError && (
              <div className="mt-4 bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm">
                {analysisError}
              </div>
            )}
          </div>
        )}

        {showSynonymBuilder && pendingInputText && (
          <SynonymBuilder
            inputText={pendingInputText}
            onComplete={handleSynonymComplete}
            onCancel={handleSynonymCancel}
          />
        )}

        {isAnalyzing && (
          <div className="mt-8 animate-slide-up">
            <div className="bg-[#1a1a2e] rounded-lg p-6 md:p-8 gradient-border text-center">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold gradient-text">
                Analyzing Your Gremlin...
              </h2>
            </div>
          </div>
        )}

        {currentAnalysis && (
          <ResultCard analysis={currentAnalysis} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
