/**
 * nutrition.types.ts — Tipos del sistema de nutrición
 * Dependencias: ninguna
 */

export interface NutritionLog {
  id: string;
  user_id: string;
  fecha: string;
  calorias_consumidas: number;
  proteina_g: number;
  carbos_g: number;
  grasas_g: number;
  comidas: Comida[];
}

export interface Comida {
  id: string;
  nombre: string;
  tipo_comida: TipoComida;
  alimentos: Alimento[];
  calorias_total: number;
  proteina_total: number;
  carbos_total: number;
  grasas_total: number;
  hora: string;
  del_plan: boolean;
}

export type TipoComida = 'DESAYUNO' | 'ALMUERZO' | 'MERIENDA' | 'CENA' | 'SNACK' | 'PRE_ENTRENO' | 'POST_ENTRENO';

export interface Alimento {
  id: string;
  nombre: string;
  cantidad_g: number;
  calorias: number;
  proteina_g: number;
  carbos_g: number;
  grasas_g: number;
  fuente: 'PLAN' | 'OPEN_FOOD_FACTS' | 'MANUAL';
  barcode: string | null;
}

export interface ComidaPlan {
  tipo_comida: TipoComida;
  nombre: string;
  alimentos: AlimentoPlan[];
  calorias_total: number;
  proteina_total: number;
  carbos_total: number;
  grasas_total: number;
  hora_sugerida: string;
}

export interface AlimentoPlan {
  nombre: string;
  cantidad_g: number;
  calorias: number;
  proteina_g: number;
  carbos_g: number;
  grasas_g: number;
}

export interface MacroObjetivos {
  calorias: number;
  proteina_g: number;
  carbos_g: number;
  grasas_g: number;
}

export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  nutriments: {
    'energy-kcal_100g': number;
    proteins_100g: number;
    carbohydrates_100g: number;
    fat_100g: number;
  };
  image_url: string | null;
}
