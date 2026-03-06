/**
 * exerciseDb.ts — Wrapper para ExerciseDB API (RapidAPI)
 * Obtiene GIFs de ejercicios para mostrar en la UI
 * Dependencias: config
 */

import { CONFIG } from '@/constants/config';

interface ExerciseDBResult {
  id: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  equipment: string;
  target: string;
}

const headers = {
  'X-RapidAPI-Key': CONFIG.EXERCISEDB_API_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
};

const gifCache = new Map<string, string>();

export async function getExerciseGif(exerciseDbId: string): Promise<string | null> {
  if (gifCache.has(exerciseDbId)) {
    return gifCache.get(exerciseDbId) ?? null;
  }

  try {
    const response = await fetch(
      `${CONFIG.EXERCISEDB_BASE_URL}/exercises/exercise/${exerciseDbId}`,
      { headers },
    );

    if (!response.ok) return null;

    const data: ExerciseDBResult = await response.json();
    const gifUrl = data.gifUrl;
    gifCache.set(exerciseDbId, gifUrl);
    return gifUrl;
  } catch {
    return null;
  }
}

export async function searchExercises(query: string): Promise<ExerciseDBResult[]> {
  try {
    const response = await fetch(
      `${CONFIG.EXERCISEDB_BASE_URL}/exercises/name/${encodeURIComponent(query)}?limit=10`,
      { headers },
    );

    if (!response.ok) return [];

    const data: ExerciseDBResult[] = await response.json();
    return data;
  } catch {
    return [];
  }
}

export function clearGifCache(): void {
  gifCache.clear();
}
