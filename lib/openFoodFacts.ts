/**
 * openFoodFacts.ts — Wrapper para Open Food Facts API (gratis)
 * Búsqueda de alimentos para tracking de calorías
 * Dependencias: config, nutrition.types
 */

import { CONFIG } from '@/constants/config';
import type { OpenFoodFactsProduct } from '@/types/nutrition.types';

interface SearchResponse {
  count: number;
  products: RawProduct[];
}

interface RawProduct {
  code: string;
  product_name?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
  image_url?: string;
}

export async function buscarAlimento(query: string): Promise<OpenFoodFactsProduct[]> {
  try {
    const url = `${CONFIG.OPEN_FOOD_FACTS_URL}/search?search_terms=${encodeURIComponent(query)}&fields=code,product_name,nutriments,image_url&page_size=15&json=1`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'FORGE-App/1.0' },
    });

    if (!response.ok) return [];

    const data: SearchResponse = await response.json();

    return data.products
      .filter((p) => p.product_name && p.nutriments)
      .map((p) => ({
        code: p.code,
        product_name: p.product_name ?? '',
        nutriments: {
          'energy-kcal_100g': p.nutriments?.['energy-kcal_100g'] ?? 0,
          proteins_100g: p.nutriments?.proteins_100g ?? 0,
          carbohydrates_100g: p.nutriments?.carbohydrates_100g ?? 0,
          fat_100g: p.nutriments?.fat_100g ?? 0,
        },
        image_url: p.image_url ?? null,
      }));
  } catch {
    return [];
  }
}

export async function getAlimentoPorBarcode(barcode: string): Promise<OpenFoodFactsProduct | null> {
  try {
    const response = await fetch(
      `${CONFIG.OPEN_FOOD_FACTS_URL}/product/${encodeURIComponent(barcode)}.json`,
      { headers: { 'User-Agent': 'FORGE-App/1.0' } },
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== 1 || !data.product) return null;

    const p = data.product as RawProduct;
    return {
      code: p.code,
      product_name: p.product_name ?? '',
      nutriments: {
        'energy-kcal_100g': p.nutriments?.['energy-kcal_100g'] ?? 0,
        proteins_100g: p.nutriments?.proteins_100g ?? 0,
        carbohydrates_100g: p.nutriments?.carbohydrates_100g ?? 0,
        fat_100g: p.nutriments?.fat_100g ?? 0,
      },
      image_url: p.image_url ?? null,
    };
  } catch {
    return null;
  }
}
