/**
 * useWorkout.ts — Lógica completa del entrenamiento activo
 * Coordina el store de workout, timer, y guardado de datos
 * Dependencias: workoutStore, planStore, useTimer
 */

import { useCallback, useMemo } from 'react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { usePlanStore } from '@/stores/planStore';
import type { EjercicioPlan, SerieCompletada } from '@/types/workout.types';

export function useWorkout() {
  const store = useWorkoutStore();
  const { getDiaHoy } = usePlanStore();

  const ejercicioActual: EjercicioPlan | null = useMemo(() => {
    if (store.planDelDia.length === 0) return null;
    const plan = store.planDelDia[store.ejercicioActualIndex];
    if (!plan) return null;

    if (store.usandoCasa && plan.variante_casa) {
      return plan.variante_casa;
    }
    return plan;
  }, [store.planDelDia, store.ejercicioActualIndex, store.usandoCasa]);

  const seriesCompletadasDelEjercicio = useMemo(() => {
    const ej = store.ejerciciosCompletados[store.ejercicioActualIndex];
    return ej?.series ?? [];
  }, [store.ejerciciosCompletados, store.ejercicioActualIndex]);

  const serieActual = useMemo(() => {
    return seriesCompletadasDelEjercicio.length + 1;
  }, [seriesCompletadasDelEjercicio]);

  const ejercicioCompletado = useMemo(() => {
    if (!ejercicioActual) return false;
    return seriesCompletadasDelEjercicio.length >= ejercicioActual.series;
  }, [ejercicioActual, seriesCompletadasDelEjercicio]);

  const workoutCompletado = useMemo(() => {
    if (store.planDelDia.length === 0) return false;
    return store.ejerciciosCompletados.every((ej) => ej.completado);
  }, [store.planDelDia, store.ejerciciosCompletados]);

  const progresoTotal = useMemo(() => {
    if (store.planDelDia.length === 0) return 0;
    const completados = store.ejerciciosCompletados.filter((e) => e.completado).length;
    return completados / store.planDelDia.length;
  }, [store.planDelDia, store.ejerciciosCompletados]);

  const registrarSerie = useCallback(
    (repsHechas: number, pesoUsado: number | null, tiempoSeg: number | null, rpe: 1 | 2 | 3 | null = null) => {
      if (!ejercicioActual) return;

      const repsObjetivo = parseInt(ejercicioActual.reps, 10) || 0;

      const serie: SerieCompletada = {
        serie_numero: serieActual,
        reps_objetivo: repsObjetivo,
        reps_hechas: repsHechas,
        peso_objetivo: ejercicioActual.peso_kg,
        peso_usado: pesoUsado,
        tiempo_seg: tiempoSeg,
        completada: true,
        rpe,
      };

      store.completarSerie(serie);
    },
    [ejercicioActual, serieActual, store],
  );

  const iniciarDescansoPostSerie = useCallback(() => {
    if (!ejercicioActual) return;
    store.iniciarDescanso(ejercicioActual.descanso_seg);
  }, [ejercicioActual, store]);

  return {
    // Estado
    ejercicioActual,
    ejercicioIndex: store.ejercicioActualIndex,
    totalEjercicios: store.planDelDia.length,
    serieActual,
    seriesCompletadasDelEjercicio,
    ejercicioCompletado,
    workoutCompletado,
    progresoTotal,
    enDescanso: store.enDescanso,
    tiempoDescanso: store.tiempoDescansoRestante,
    workoutActivo: store.workoutLogId !== null,
    loading: store.loading,
    error: store.error,

    // Acciones
    iniciarWorkout: store.iniciarWorkout,
    registrarSerie,
    iniciarDescansoPostSerie,
    siguienteEjercicio: store.siguienteEjercicio,
    finalizarDescanso: store.finalizarDescanso,
    finalizarWorkout: store.finalizarWorkout,
    cancelarWorkout: store.cancelarWorkout,
  };
}
