/**
 * config.ts — Configuración general de la app
 * URLs de API, timeouts, constantes de comportamiento
 * Dependencias: ninguna
 */

export const CONFIG = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  EXERCISEDB_API_KEY: process.env.EXPO_PUBLIC_EXERCISEDB_API_KEY ?? '',
  EXERCISEDB_BASE_URL: 'https://exercisedb.p.rapidapi.com',
  OPEN_FOOD_FACTS_URL: 'https://world.openfoodfacts.org/api/v2',
  AI_TIMEOUT_MS: 60000,
  REST_DEFAULT_SEC: 90,
  REST_HEAVY_SEC: 180,
  CHECKIN_HOUR: 21,
  CHECKIN_MINUTE: 30,
  PHOTO_DAY: 0, // domingo
  MAX_WORKOUT_DURATION_MIN: 120,
  CACHE_STALE_TIME_MS: 5 * 60 * 1000,
  CALORIES_BUFFER: 100,
} as const;

export const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] as const;

export const DIAS_SEMANA_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;

export const HABITOS_DEFAULT = [
  'Despertar antes de las 7:00',
  'Entrenar',
  'Comer según plan',
  'Leer 20 minutos',
  'Meditar 10 minutos',
  'Sin redes sociales antes de las 12:00',
  'Dormir antes de las 23:00',
  'Tomar 3L de agua',
] as const;

export const ADICCIONES_DISPONIBLES = [
  { id: 'pornografia', label: 'Pornografía', icono: '🚫' },
  { id: 'nicotina', label: 'Nicotina', icono: '🚬' },
  { id: 'redes_sociales', label: 'Redes sociales', icono: '📱' },
  { id: 'comida_basura', label: 'Comida basura', icono: '🍔' },
  { id: 'videojuegos', label: 'Videojuegos excesivos', icono: '🎮' },
] as const;
