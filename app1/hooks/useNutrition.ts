/**
 * useNutrition.ts — Tracking de calorías y comidas
 * Dependencias: nutritionStore, userStore
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useNutritionStore } from '@/stores/nutritionStore';
import { useUserStore } from '@/stores/userStore';
import type { Comida, TipoComida } from '@/types/nutrition.types';

export function useNutrition() {
  const store = useNutritionStore();
  const profile = useUserStore((s) => s.profile);

  useEffect(() => {
    store.fetchLogHoy();
  }, []);

  const objetivos = useMemo(
    () => ({
      calorias: profile?.calorias_objetivo ?? 2800,
      proteina_g: profile?.proteina_g ?? 160,
      carbos_g: profile?.carbos_g ?? 300,
      grasas_g: profile?.grasas_g ?? 80,
    }),
    [profile],
  );

  const consumido = useMemo(
    () => ({
      calorias: store.logHoy?.calorias_consumidas ?? 0,
      proteina_g: store.logHoy?.proteina_g ?? 0,
      carbos_g: store.logHoy?.carbos_g ?? 0,
      grasas_g: store.logHoy?.grasas_g ?? 0,
    }),
    [store.logHoy],
  );

  const restante = useMemo(
    () => ({
      calorias: objetivos.calorias - consumido.calorias,
      proteina_g: objetivos.proteina_g - consumido.proteina_g,
      carbos_g: objetivos.carbos_g - consumido.carbos_g,
      grasas_g: objetivos.grasas_g - consumido.grasas_g,
    }),
    [objetivos, consumido],
  );

  const progresoCalorias = useMemo(() => {
    if (objetivos.calorias === 0) return 0;
    return Math.min(consumido.calorias / objetivos.calorias, 1);
  }, [consumido.calorias, objetivos.calorias]);

  const comidas = useMemo(() => store.logHoy?.comidas ?? [], [store.logHoy]);

  return {
    logHoy: store.logHoy,
    comidas,
    objetivos,
    consumido,
    restante,
    progresoCalorias,
    loading: store.loading,
    error: store.error,
    agregarComida: store.agregarComida,
    eliminarComida: store.eliminarComida,
    actualizarComida: store.actualizarComida,
    refetch: store.fetchLogHoy,
  };
}
