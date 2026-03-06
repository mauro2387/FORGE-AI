/**
 * user.types.ts — Tipos del usuario, perfil y configuración
 * Dependencias: ninguna
 */

export interface UserProfile {
  id: string;
  nombre: string;
  edad: number;
  peso_actual: number;
  altura: number;
  peso_objetivo: number;
  fase_actual: FasePrograma;
  semana_programa: number;
  calorias_objetivo: number;
  proteina_g: number;
  carbos_g: number;
  grasas_g: number;
  analisis_fisico: AnalisisFisico | null;
  primer_foto_path: string | null;
  tiene_gym: boolean;
  onboarding_completo: boolean;
  created_at: string;
  updated_at: string;
}

export type FasePrograma = 'FASE_1' | 'FASE_2' | 'FASE_3' | 'FASE_4';

export interface AnalisisFisico {
  nivel_fitness: string;
  fortalezas: string[];
  debilidades: string[];
  recomendaciones: string[];
  estimacion_grasa_corporal: number;
  plan_resumen: string;
}

export interface OnboardingData {
  nombre: string;
  edad: number;
  peso_actual: number;
  altura: number;
  peso_objetivo: number;
  historial_entrenamiento: string;
  meses_inactivo: number;
  pruebas_fisicas: PruebasFisicas;
  adicciones: string[];
  apps_bloquear: AppBloqueo[];
  fotos: FotoOnboarding[];
}

export interface PruebasFisicas {
  flexiones_max: number;
  dominadas_max: number;
  tiempo_1km_seg: number;
  plancha_seg: number;
  sentadillas_max: number;
}

export interface AppBloqueo {
  app_package: string;
  app_nombre: string;
  horario_inicio: string;
  horario_fin: string;
  dias: number[];
  activo: boolean;
}

export interface FotoOnboarding {
  uri: string;
  tipo: 'FRENTE' | 'PERFIL' | 'ESPALDA';
}

export interface BandData {
  id: string;
  user_id: string;
  fecha: string;
  pasos: number;
  calorias_activas: number;
  fc_promedio: number;
  fc_max: number;
  sueno_horas: number;
  sueno_profundo_horas: number;
}
