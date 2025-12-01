// src/app/utils/textProcessing.ts

import { STOP_WORDS } from './stopWords';

export function extractMeaningfulWords(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0)
    .filter(word => word.length > 2)
    .filter(word => !STOP_WORDS.has(word));

  return words;
}

export function deduplicateWords(words: string[]): string[] {
  return Array.from(new Set(words));
}

export function buildEnrichedText(
  originalText: string,
  meaningfulWords: string[],
  synonymMap: { [word: string]: string[] }
): string {
  let enrichedText = originalText.toLowerCase();

  meaningfulWords.forEach(word => {
    const synonyms = synonymMap[word];
    if (synonyms && synonyms.length > 0) {
      const synonymString = synonyms.slice(0, 3).join(', ');
      const pattern = new RegExp(`\\b${word}\\b`, 'gi');
      enrichedText = enrichedText.replace(
        pattern,
        `${word} (${synonymString})`
      );
    }
  });

  return enrichedText;
}