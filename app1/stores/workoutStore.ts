/**
 * workoutStore.ts — Estado del entrenamiento activo
 * Offline-first: guarda localmente primero, sincroniza después
 * Dependencias: workout.types, supabase
 */

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type {
  EjercicioPlan,
  EjercicioCompletado,
  SerieCompletada,
  WorkoutActiveState,
  WorkoutLog,
} from '@/types/workout.types';

interface WorkoutState extends WorkoutActiveState {
  planDelDia: EjercicioPlan[];
  loading: boolean;
  error: string | null;

  iniciarWorkout: (tipoOPlan: string | EjercicioPlan[], ubicacionOCasa?: string | boolean, planEjerciciosOpt?: EjercicioPlan[]) => Promise<void>;
  completarSerie: (serie: SerieCompletada) => void;
  siguienteEjercicio: () => void;
  iniciarDescanso: (segundos: number) => void;
  tickDescanso: () => void;
  finalizarDescanso: () => void;
  finalizarWorkout: () => Promise<void>;
  cancelarWorkout: () => void;
  resetWorkout: () => void;
}

const INITIAL_STATE: WorkoutActiveState = {
  workoutLogId: null,
  ejercicioActualIndex: 0,
  serieActualIndex: 0,
  enDescanso: false,
  tiempoDescansoRestante: 0,
  ejerciciosCompletados: [],
  inicioWorkout: null,
  usandoCasa: false,
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  ...INITIAL_STATE,
  planDelDia: [],
  loading: false,
  error: null,

  iniciarWorkout: async (tipoOPlan, ubicacionOCasa, planEjerciciosOpt) => {
    let planEjercicios: EjercicioPlan[];
    let usarCasa = false;
    if (Array.isArray(tipoOPlan)) {
      planEjercicios = tipoOPlan;
      usarCasa = ubicacionOCasa === true;
    } else {
      planEjercicios = planEjerciciosOpt ?? [];
      usarCasa = typeof ubicacionOCasa === 'string' && ubicacionOCasa === 'CASA';
    }
    set({ loading: true, error: null });
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) throw new Error('Sin sesión');

      const hoy = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: userId,
          fecha: hoy,
          plan_ejercicios: planEjercicios,
          completado: false,
        })
        .select('id')
        .single();

      if (error) throw error;

      set({
        workoutLogId: data.id,
        planDelDia: planEjercicios,
        ejercicioActualIndex: 0,
        serieActualIndex: 0,
        enDescanso: false,
        tiempoDescansoRestante: 0,
        ejerciciosCompletados: [],
        inicioWorkout: Date.now(),
        usandoCasa: usarCasa,
        loading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar workout';
      logger.error('iniciarWorkout:', message);
      set({ error: message, loading: false });
    }
  },

  completarSerie: (serie) => {
    const state = get();
    const ejercicioIndex = state.ejercicioActualIndex;
    const plan = state.planDelDia[ejercicioIndex];
    if (!plan) return;

    const completados = [...state.ejerciciosCompletados];
    let ejercicioComp = completados[ejercicioIndex];

    if (!ejercicioComp) {
      ejercicioComp = {
        nombre: plan.nombre,
        series: [],
        completado: false,
      };
      completados[ejercicioIndex] = ejercicioComp;
    }

    ejercicioComp.series.push(serie);

    const todasCompletadas = ejercicioComp.series.length >= plan.series;
    ejercicioComp.completado = todasCompletadas;

    set({
      ejerciciosCompletados: completados,
      serieActualIndex: serie.serie_numero,
    });
  },

  siguienteEjercicio: () => {
    const state = get();
    const nextIndex = state.ejercicioActualIndex + 1;
    if (nextIndex < state.planDelDia.length) {
      set({
        ejercicioActualIndex: nextIndex,
        serieActualIndex: 0,
        enDescanso: false,
        tiempoDescansoRestante: 0,
      });
    }
  },

  iniciarDescanso: (segundos) => {
    set({ enDescanso: true, tiempoDescansoRestante: segundos });
  },

  tickDescanso: () => {
    const remaining = get().tiempoDescansoRestante;
    if (remaining <= 0) {
      set({ enDescanso: false, tiempoDescansoRestante: 0 });
    } else {
      set({ tiempoDescansoRestante: remaining - 1 });
    }
  },

  finalizarDescanso: () => {
    set({ enDescanso: false, tiempoDescansoRestante: 0 });
  },

  finalizarWorkout: async () => {
    const state = get();
    if (!state.workoutLogId) return;

    set({ loading: true });
    try {
      const duracion = state.inicioWorkout
        ? Math.round((Date.now() - state.inicioWorkout) / 60000)
        : 0;

      const { error } = await supabase
        .from('workout_logs')
        .update({
          ejercicios_completados: state.ejerciciosCompletados,
          duracion_min: duracion,
          completado: true,
        })
        .eq('id', state.workoutLogId);

      if (error) throw error;

      // Guardar series individuales
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      const hoy = new Date().toISOString().split('T')[0];

      if (userId) {
        const seriesRows = state.ejerciciosCompletados.flatMap((ej) =>
          ej.series.map((s) => ({
            user_id: userId,
            workout_log_id: state.workoutLogId,
            fecha: hoy,
            ejercicio_nombre: ej.nombre,
            serie_numero: s.serie_numero,
            reps_objetivo: s.reps_objetivo,
            reps_hechas: s.reps_hechas,
            peso_objetivo: s.peso_objetivo,
            peso_usado: s.peso_usado,
            tiempo_seg: s.tiempo_seg,
            completada: s.completada,
          })),
        );

        if (seriesRows.length > 0) {
          await supabase.from('series_logs').insert(seriesRows);
        }
      }

      set({ ...INITIAL_STATE, planDelDia: [], loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al finalizar workout';
      logger.error('finalizarWorkout:', message);
      set({ error: message, loading: false });
    }
  },

  cancelarWorkout: () => {
    const state = get();
    if (state.workoutLogId) {
      supabase
        .from('workout_logs')
        .delete()
        .eq('id', state.workoutLogId)
        .then(({ error }) => {
          if (error) logger.error('cancelarWorkout delete:', error.message);
        });
    }
    set({ ...INITIAL_STATE, planDelDia: [] });
  },

  resetWorkout: () => {
    set({ ...INITIAL_STATE, planDelDia: [] });
  },
}));
