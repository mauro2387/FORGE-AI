/**
 * plan.types.ts — Tipos del plan semanal y check-in
 * Dependencias: workout.types, nutrition.types
 */

import type { DiaPlan } from './workout.types';
import type { ComidaPlan } from './nutrition.types';

export interface WeeklyPlan {
  id: string;
  user_id: string;
  semana_numero: number;
  fecha_inicio: string;
  plan: PlanSemana;
  plan_comidas: PlanComidasSemana | null;
  analisis_semana_anterior: AnalisisSemana | null;
  created_at: string;
}

export interface PlanSemana {
  lunes: DiaPlan;
  martes: DiaPlan;
  miercoles: DiaPlan;
  jueves: DiaPlan;
  viernes: DiaPlan;
  sabado: DiaPlan;
  domingo: DiaPlan;
  mensaje_semana: string;
  enfoque_semana: string;
  notas_ia: string;
}

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export interface PlanComidasSemana {
  lunes: ComidaPlan[];
  martes: ComidaPlan[];
  miercoles: ComidaPlan[];
  jueves: ComidaPlan[];
  viernes: ComidaPlan[];
  sabado: ComidaPlan[];
  domingo: ComidaPlan[];
}

export interface AnalisisSemana {
  entrenamiento_completado: number;
  entrenamiento_total: number;
  calorias_promedio: number;
  proteina_promedio: number;
  habitos_completados: number;
  habitos_total: number;
  rachas_activas: number;
  peso_actual: number;
  delta_peso: number;
  notas_ia: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  fecha: string;
  estado_dia: string | null;
  nota_numerica: number | null;
  respuesta_usuario: string | null;
  feedback_ia: string | null;
  tarea_manana: string | null;
}

export interface HabitLog {
  id: string;
  user_id: string;
  fecha: string;
  habito: string;
  completado: boolean;
}

export interface AddictionStreak {
  id: string;
  user_id: string;
  tipo: string;
  fecha_inicio_racha: string;
  racha_actual_dias: number;
  mejor_racha_dias: number;
  total_resets: number;
  ultimo_reset: string | null;
}

export interface BodyPhoto {
  id: string;
  user_id: string;
  fecha: string;
  tipo: 'BASELINE' | 'SEMANAL';
  storage_path: string;
  analisis_ia: string | null;
  created_at: string;
}
