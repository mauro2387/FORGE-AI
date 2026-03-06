/**
 * ai.types.ts — Tipos para la integración con Claude API
 * Dependencias: ninguna
 */

export type ForgePromptType = 'ONBOARDING' | 'PLAN_SEMANAL' | 'CHECKIN' | 'CONSULTA';

export interface ForgeAIRequest {
  tipo: ForgePromptType;
  datos: Record<string, unknown>;
}

export interface ForgeAIResponse {
  success: boolean;
  data: Record<string, unknown>;
  error: string | null;
  tokens_used: number;
}

export interface OnboardingAIRequest {
  nombre: string;
  edad: number;
  peso_actual: number;
  altura: number;
  peso_objetivo: number;
  historial_entrenamiento: string;
  meses_inactivo: number;
  pruebas_fisicas: {
    flexiones_max: number;
    dominadas_max: number;
    tiempo_1km_seg: number;
    plancha_seg: number;
    sentadillas_max: number;
  };
  adicciones: string[];
  tiene_fotos: boolean;
}

export interface OnboardingAIResponse {
  analisis_fisico: {
    nivel_fitness: string;
    fortalezas: string[];
    debilidades: string[];
    recomendaciones: string[];
    estimacion_grasa_corporal: number;
    plan_resumen: string;
  };
  macros: {
    calorias_objetivo: number;
    proteina_g: number;
    carbos_g: number;
    grasas_g: number;
  };
  plan_semana_1: Record<string, unknown>;
  plan_comidas_semana_1: Record<string, unknown>;
  habitos_recomendados: string[];
  mensaje_bienvenida: string;
}

export interface PlanSemanalAIRequest {
  perfil_usuario: Record<string, unknown>;
  semana_numero: number;
  resumen_semana_anterior: Record<string, unknown>;
  strength_records: Record<string, unknown>[] | null;
  modo_hibrido: boolean;
  foto_semanal: boolean;
}

export interface CheckinAIRequest {
  perfil_usuario: Record<string, unknown>;
  datos_dia: {
    workout_completado: boolean;
    calorias_consumidas: number;
    habitos_completados: string[];
    habitos_no_completados: string[];
    rachas_activas: Record<string, number>;
    band_data: Record<string, unknown> | null;
  };
  respuesta_usuario: string;
}

export interface ConsultaAIRequest {
  perfil_usuario: Record<string, unknown>;
  pregunta: string;
  contexto: Record<string, unknown> | null;
}

export interface AILoadingState {
  loading: boolean;
  error: string | null;
  progress: number;
}
