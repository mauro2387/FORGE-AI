/**
 * useHabits.ts — CRUD de hábitos y rachas
 * Wrapper sobre habitsStore con lógica adicional
 * Dependencias: habitsStore
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useHabitsStore } from '@/stores/habitsStore';
import { HABITOS_DEFAULT } from '@/constants/config';

export function useHabits() {
  const store = useHabitsStore();

  useEffect(() => {
    store.fetchHabitosHoy();
    store.fetchRachas();
  }, []);

  const habitosConEstado = useMemo(() => {
    return HABITOS_DEFAULT.map((habito) => {
      const log = store.habitosHoy.find((h) => h.habito === habito);
      return {
        nombre: habito,
        completado: log?.completado ?? false,
      };
    });
  }, [store.habitosHoy]);

  const totalCompletados = useMemo(() => {
    return habitosConEstado.filter((h) => h.completado).length;
  }, [habitosConEstado]);

  const progresoHabitos = useMemo(() => {
    if (habitosConEstado.length === 0) return 0;
    return totalCompletados / habitosConEstado.length;
  }, [totalCompletados, habitosConEstado.length]);

  const toggleHabito = useCallback(
    (habito: string) => {
      store.toggleHabito(habito);
    },
    [store],
  );

  const rachasActivas = useMemo(() => {
    return store.rachas.filter((r) => r.racha_actual_dias > 0);
  }, [store.rachas]);

  return {
    habitosConEstado,
    totalCompletados,
    totalHabitos: habitosConEstado.length,
    progresoHabitos,
    rachas: store.rachas,
    rachasActivas,
    loading: store.loading,
    error: store.error,
    toggleHabito,
    resetRacha: store.resetRacha,
    iniciarRacha: store.iniciarRacha,
    refetch: () => {
      store.fetchHabitosHoy();
      store.fetchRachas();
    },
  };
}
