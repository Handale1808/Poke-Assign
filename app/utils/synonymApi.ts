// src/app/utils/synonymApi.ts

const DATAMUSE_API = 'https://api.datamuse.com/words';
const MAX_SYNONYMS = 5;
const REQUEST_DELAY = 100;

interface DataMuseWord {
  word: string;
  score: number;
}

export async function fetchSynonymsForWord(word: string): Promise<string[]> {
  try {
    const response = await fetch(`${DATAMUSE_API}?ml=${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      console.error(`Failed to fetch synonyms for "${word}":`, response.status);
      return [];
    }

    const data: DataMuseWord[] = await response.json();
    
    const synonyms = data
      .slice(0, MAX_SYNONYMS)
      .map(item => item.word)
      .filter(synonym => synonym.toLowerCase() !== word.toLowerCase());

    return synonyms;
  } catch (error) {
    console.error(`Error fetching synonyms for "${word}":`, error);
    return [];
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchAllSynonyms(
  words: string[]
): Promise<{ [word: string]: string[] }> {
  const synonymMap: { [word: string]: string[] } = {};

  for (const word of words) {
    synonymMap[word] = await fetchSynonymsForWord(word);
    
    if (words.indexOf(word) < words.length - 1) {
      await delay(REQUEST_DELAY);
    }
  }

  return synonymMap;
}