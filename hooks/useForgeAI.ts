/**
 * useForgeAI.ts — Llamadas a Claude con loading/error states
 * Dependencias: claude, ai.types
 */

import { useCallback, useState } from 'react';
import {
  analizarOnboarding,
  generarPlanSemanal,
  procesarCheckin,
  consultarIA,
} from '@/lib/claude';
import type {
  OnboardingAIRequest,
  OnboardingAIResponse,
  PlanSemanalAIRequest,
  CheckinAIRequest,
  ConsultaAIRequest,
  AILoadingState,
} from '@/types/ai.types';

export function useForgeAI() {
  const [state, setState] = useState<AILoadingState>({
    loading: false,
    error: null,
    progress: 0,
  });

  const ejecutarConLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setState({ loading: true, error: null, progress: 0 });

    // Simular progreso mientras espera respuesta
    const progressInterval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 0.05, 0.9),
      }));
    }, 2000);

    try {
      const result = await fn();
      setState({ loading: false, error: null, progress: 1 });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de IA';
      setState({ loading: false, error: message, progress: 0 });
      return null;
    } finally {
      clearInterval(progressInterval);
    }
  }, []);

  const onboarding = useCallback(
    async (request: OnboardingAIRequest): Promise<OnboardingAIResponse | null> => {
      return ejecutarConLoading(() => analizarOnboarding(request));
    },
    [ejecutarConLoading],
  );

  const planSemanal = useCallback(
    async (request: PlanSemanalAIRequest): Promise<Record<string, unknown> | null> => {
      return ejecutarConLoading(() => generarPlanSemanal(request));
    },
    [ejecutarConLoading],
  );

  const checkin = useCallback(
    async (
      request: CheckinAIRequest,
    ): Promise<{ feedback: string; tarea_manana: string } | null> => {
      return ejecutarConLoading(() => procesarCheckin(request));
    },
    [ejecutarConLoading],
  );

  const consulta = useCallback(
    async (request: ConsultaAIRequest): Promise<{ respuesta: string } | null> => {
      return ejecutarConLoading(() => consultarIA(request));
    },
    [ejecutarConLoading],
  );

  return {
    ...state,
    onboarding,
    planSemanal,
    checkin,
    consulta,
    clearError: () => setState((prev) => ({ ...prev, error: null })),
  };
}
