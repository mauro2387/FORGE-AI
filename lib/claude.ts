/**
 * claude.ts — Funciones para llamar a Claude via Supabase Edge Functions
 * NUNCA expone la API key en el cliente. Todo pasa por Edge Functions.
 * Dependencias: supabase.ts, ai.types
 */

import { supabase } from './supabase';
import type {
  ForgeAIResponse,
  OnboardingAIRequest,
  OnboardingAIResponse,
  PlanSemanalAIRequest,
  CheckinAIRequest,
  ConsultaAIRequest,
} from '@/types/ai.types';

async function callEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error('No hay sesión activa. Iniciá sesión primero.');
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    throw new Error(`Error en ${functionName}: ${error.message}`);
  }

  const response = data as ForgeAIResponse;
  if (!response.success) {
    throw new Error(response.error ?? 'Error desconocido de IA');
  }

  return response.data as T;
}

export async function analizarOnboarding(
  request: OnboardingAIRequest,
): Promise<OnboardingAIResponse> {
  return callEdgeFunction<OnboardingAIResponse>('forge-onboarding', {
    tipo: 'ONBOARDING',
    datos: request,
  });
}

export async function generarPlanSemanal(
  request: PlanSemanalAIRequest,
): Promise<Record<string, unknown>> {
  return callEdgeFunction<Record<string, unknown>>('forge-plan-semanal', {
    tipo: 'PLAN_SEMANAL',
    datos: request,
  });
}

export async function procesarCheckin(
  request: CheckinAIRequest,
): Promise<{ feedback: string; tarea_manana: string }> {
  return callEdgeFunction<{ feedback: string; tarea_manana: string }>('forge-checkin', {
    tipo: 'CHECKIN',
    datos: request,
  });
}

export async function consultarIA(
  request: ConsultaAIRequest,
): Promise<{ respuesta: string }> {
  return callEdgeFunction<{ respuesta: string }>('forge-consulta', {
    tipo: 'CONSULTA',
    datos: request,
  });
}
