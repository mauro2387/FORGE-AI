/**
 * workout.types.ts — Tipos del sistema de entrenamiento
 * Dependencias: ninguna
 */

export type TipoEjercicio = 'GYM' | 'CALISTENIA' | 'CARDIO' | 'COMBATE' | 'RUCK';
export type GrupoMuscular = 'EMPUJE' | 'JALE' | 'PIERNAS' | 'CORE' | 'CARDIO' | 'COMBATE';
export type TipoSesion = 'GYM_FUERZA' | 'GYM_HIPERTROFIA' | 'GYM_VOLUMEN' | 'CALISTENIA' | 'COMBATE' | 'RUCK' | 'CARDIO' | 'DESCANSO';
export type Ubicacion = 'GYM' | 'CASA' | 'PARQUE' | 'CALLE';
export type TipoProgresion = 'LINEAL' | 'ONDULANTE';
export type RPE = 1 | 2 | 3;

export interface Ejercicio {
  id: string;
  nombre: string;
  grupo_muscular: GrupoMuscular;
  tipo: TipoEjercicio;
  requiere: string[];
  variante_casa: string | null;
  exercise_db_id: string | null;
  notas_tecnica: string;
  progresion_recomendada: TipoProgresion;
  incremento_kg_por_sesion: number;
}

export interface EjercicioPlan {
  nombre: string;
  exercise_db_id: string | null;
  series: number;
  reps: string;
  peso_kg: number | null;
  porcentaje_1rm: number | null;
  one_rm_actual: number | null;
  descanso_seg: number;
  progresion: TipoProgresion | null;
  incremento_kg: number | null;
  notas: string;
  variante_casa: EjercicioPlan | null;
  tiempo_seg: number | null;
  es_isometrico: boolean;
}

export interface DiaPlan {
  tipo: TipoSesion;
  ubicacion: Ubicacion;
  ejercicios: EjercicioPlan[];
  calentamiento: string;
  enfriamiento: string;
  duracion_estimada_min: number;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  fecha: string;
  plan_ejercicios: EjercicioPlan[];
  ejercicios_completados: EjercicioCompletado[] | null;
  duracion_min: number | null;
  completado: boolean;
  notas: string | null;
  created_at: string;
}

export interface EjercicioCompletado {
  nombre: string;
  series: SerieCompletada[];
  completado: boolean;
}

export interface SerieCompletada {
  serie_numero: number;
  reps_objetivo: number;
  reps_hechas: number;
  peso_objetivo: number | null;
  peso_usado: number | null;
  tiempo_seg: number | null;
  completada: boolean;
  rpe: RPE | null;
}

export interface SerieLog {
  id: string;
  user_id: string;
  workout_log_id: string;
  fecha: string;
  ejercicio_nombre: string;
  serie_numero: number;
  reps_objetivo: number | null;
  reps_hechas: number | null;
  peso_objetivo: number | null;
  peso_usado: number | null;
  tiempo_seg: number | null;
  completada: boolean;
  created_at: string;
}

export interface StrengthRecord {
  id: string;
  user_id: string;
  ejercicio: string;
  fecha: string;
  peso_kg: number;
  reps: number;
  one_rm_estimado: number;
}

export interface WorkoutActiveState {
  workoutLogId: string | null;
  ejercicioActualIndex: number;
  serieActualIndex: number;
  enDescanso: boolean;
  tiempoDescansoRestante: number;
  ejerciciosCompletados: EjercicioCompletado[];
  inicioWorkout: number | null;
  usandoCasa: boolean;
}

export function calcular1RM(peso: number, reps: number): number {
  if (reps === 0) return 0;
  if (reps === 1) return peso;
  return Math.round(peso * (1 + reps / 30) * 100) / 100;
}

export function calcularPesoPorcentaje(oneRM: number, porcentaje: number): number {
  return Math.round((oneRM * porcentaje) / 100 / 2.5) * 2.5;
}
