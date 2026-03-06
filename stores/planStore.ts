/**
 * planStore.ts — Plan semanal activo
 * Dependencias: plan.types, supabase
 */

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { WeeklyPlan, DiaSemana, PlanSemana } from '@/types/plan.types';
import type { DiaPlan } from '@/types/workout.types';

interface PlanState {
  planActual: WeeklyPlan | null;
  loading: boolean;
  error: string | null;

  fetchPlanActual: () => Promise<void>;
  setPlanActual: (plan: WeeklyPlan) => void;
  getDiaHoy: () => DiaPlan | null;
  getDiaSemana: () => DiaSemana;
}

const DIAS_MAP: DiaSemana[] = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

export const usePlanStore = create<PlanState>((set, get) => ({
  planActual: null,
  loading: false,
  error: null,

  fetchPlanActual: async () => {
    set({ loading: true, error: null });
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) throw new Error('Sin sesión');

      const { data, error } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', userId)
        .order('semana_numero', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      set({ planActual: data as WeeklyPlan | null, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar plan';
      logger.error('fetchPlanActual:', message);
      set({ error: message, loading: false });
    }
  },

  setPlanActual: (plan) => {
    set({ planActual: plan, error: null });
  },

  getDiaHoy: () => {
    const plan = get().planActual;
    if (!plan) return null;

    const dia = get().getDiaSemana();
    const planSemana = plan.plan as PlanSemana;
    return planSemana[dia] ?? null;
  },

  getDiaSemana: () => {
    const dayIndex = new Date().getDay();
    return DIAS_MAP[dayIndex];
  },
}));
