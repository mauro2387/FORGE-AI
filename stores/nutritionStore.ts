/**
 * nutritionStore.ts — Comidas y calorías del día
 * Dependencias: nutrition.types, supabase
 */

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { NutritionLog, Comida, Alimento, TipoComida } from '@/types/nutrition.types';

interface NutritionState {
  logHoy: NutritionLog | null;
  loading: boolean;
  error: string | null;

  fetchLogHoy: () => Promise<void>;
  agregarComida: (comida: Omit<Comida, 'id'>) => Promise<void>;
  eliminarComida: (comidaId: string) => Promise<void>;
  actualizarComida: (comidaId: string, updates: Partial<Comida>) => Promise<void>;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function calcularTotales(comidas: Comida[]) {
  return comidas.reduce(
    (acc, c) => ({
      calorias: acc.calorias + c.calorias_total,
      proteina: acc.proteina + c.proteina_total,
      carbos: acc.carbos + c.carbos_total,
      grasas: acc.grasas + c.grasas_total,
    }),
    { calorias: 0, proteina: 0, carbos: 0, grasas: 0 },
  );
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  logHoy: null,
  loading: false,
  error: null,

  fetchLogHoy: async () => {
    set({ loading: true, error: null });
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) throw new Error('Sin sesión');

      const hoy = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('fecha', hoy)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        set({ logHoy: data as NutritionLog, loading: false });
      } else {
        // Crear log vacío para hoy
        const newLog = {
          user_id: userId,
          fecha: hoy,
          calorias_consumidas: 0,
          proteina_g: 0,
          carbos_g: 0,
          grasas_g: 0,
          comidas: [],
        };

        const { data: created, error: createError } = await supabase
          .from('nutrition_logs')
          .insert(newLog)
          .select('*')
          .single();

        if (createError) throw createError;
        set({ logHoy: created as NutritionLog, loading: false });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar nutrición';
      logger.error('fetchLogHoy:', message);
      set({ error: message, loading: false });
    }
  },

  agregarComida: async (comidaSinId) => {
    const log = get().logHoy;
    if (!log) return;

    const comida: Comida = { ...comidaSinId, id: generateId() };
    const nuevasComidas = [...log.comidas, comida];
    const totales = calcularTotales(nuevasComidas);

    const updatedLog: NutritionLog = {
      ...log,
      comidas: nuevasComidas,
      calorias_consumidas: totales.calorias,
      proteina_g: totales.proteina,
      carbos_g: totales.carbos,
      grasas_g: totales.grasas,
    };

    // Optimistic update
    set({ logHoy: updatedLog });

    try {
      const { error } = await supabase
        .from('nutrition_logs')
        .update({
          comidas: updatedLog.comidas,
          calorias_consumidas: updatedLog.calorias_consumidas,
          proteina_g: updatedLog.proteina_g,
          carbos_g: updatedLog.carbos_g,
          grasas_g: updatedLog.grasas_g,
        })
        .eq('id', log.id);

      if (error) throw error;
    } catch (err) {
      // Revert
      set({ logHoy: log });
      const message = err instanceof Error ? err.message : 'Error al agregar comida';
      logger.error('agregarComida:', message);
      set({ error: message });
    }
  },

  eliminarComida: async (comidaId) => {
    const log = get().logHoy;
    if (!log) return;

    const nuevasComidas = log.comidas.filter((c) => c.id !== comidaId);
    const totales = calcularTotales(nuevasComidas);

    const updatedLog: NutritionLog = {
      ...log,
      comidas: nuevasComidas,
      calorias_consumidas: totales.calorias,
      proteina_g: totales.proteina,
      carbos_g: totales.carbos,
      grasas_g: totales.grasas,
    };

    set({ logHoy: updatedLog });

    try {
      const { error } = await supabase
        .from('nutrition_logs')
        .update({
          comidas: updatedLog.comidas,
          calorias_consumidas: updatedLog.calorias_consumidas,
          proteina_g: updatedLog.proteina_g,
          carbos_g: updatedLog.carbos_g,
          grasas_g: updatedLog.grasas_g,
        })
        .eq('id', log.id);

      if (error) throw error;
    } catch (err) {
      set({ logHoy: log });
      const message = err instanceof Error ? err.message : 'Error al eliminar comida';
      logger.error('eliminarComida:', message);
      set({ error: message });
    }
  },

  actualizarComida: async (comidaId, updates) => {
    const log = get().logHoy;
    if (!log) return;

    const nuevasComidas = log.comidas.map((c) =>
      c.id === comidaId ? { ...c, ...updates } : c,
    );
    const totales = calcularTotales(nuevasComidas);

    const updatedLog: NutritionLog = {
      ...log,
      comidas: nuevasComidas,
      calorias_consumidas: totales.calorias,
      proteina_g: totales.proteina,
      carbos_g: totales.carbos,
      grasas_g: totales.grasas,
    };

    set({ logHoy: updatedLog });

    try {
      const { error } = await supabase
        .from('nutrition_logs')
        .update({
          comidas: updatedLog.comidas,
          calorias_consumidas: updatedLog.calorias_consumidas,
          proteina_g: updatedLog.proteina_g,
          carbos_g: updatedLog.carbos_g,
          grasas_g: updatedLog.grasas_g,
        })
        .eq('id', log.id);

      if (error) throw error;
    } catch (err) {
      set({ logHoy: log });
      const message = err instanceof Error ? err.message : 'Error al actualizar comida';
      logger.error('actualizarComida:', message);
      set({ error: message });
    }
  },
}));
