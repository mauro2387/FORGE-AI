/**
 * habitsStore.ts — Hábitos y rachas de adicciones
 * Dependencias: plan.types, supabase
 */

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { HabitLog, AddictionStreak } from '@/types/plan.types';

interface HabitsState {
  habitosHoy: HabitLog[];
  rachas: AddictionStreak[];
  loading: boolean;
  error: string | null;

  fetchHabitosHoy: () => Promise<void>;
  fetchRachas: () => Promise<void>;
  toggleHabito: (habito: string) => Promise<void>;
  resetRacha: (tipo: string) => Promise<void>;
  iniciarRacha: (tipo: string) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habitosHoy: [],
  rachas: [],
  loading: false,
  error: null,

  fetchHabitosHoy: async () => {
    set({ loading: true, error: null });
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) throw new Error('Sin sesión');

      const hoy = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('fecha', hoy);

      if (error) throw error;
      set({ habitosHoy: (data as HabitLog[]) ?? [], loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar hábitos';
      logger.error('fetchHabitosHoy:', message);
      set({ error: message, loading: false });
    }
  },

  fetchRachas: async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('addiction_streaks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      set({ rachas: (data as AddictionStreak[]) ?? [] });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar rachas';
      logger.error('fetchRachas:', message);
    }
  },

  toggleHabito: async (habito) => {
    const hoy = new Date().toISOString().split('T')[0];
    const habitosHoy = get().habitosHoy;
    const existing = habitosHoy.find((h) => h.habito === habito);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) throw new Error('Sin sesión');

      if (existing) {
        const nuevoEstado = !existing.completado;
        // Optimistic
        set({
          habitosHoy: habitosHoy.map((h) =>
            h.habito === habito ? { ...h, completado: nuevoEstado } : h,
          ),
        });

        const { error } = await supabase
          .from('habit_logs')
          .update({ completado: nuevoEstado })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const newLog: Omit<HabitLog, 'id'> = {
          user_id: userId,
          fecha: hoy,
          habito,
          completado: true,
        };

        const { data, error } = await supabase
          .from('habit_logs')
          .insert(newLog)
          .select('*')
          .single();

        if (error) throw error;
        set({ habitosHoy: [...habitosHoy, data as HabitLog] });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar hábito';
      logger.error('toggleHabito:', message);
      set({ error: message });
      // Revert
      await get().fetchHabitosHoy();
    }
  },

  resetRacha: async (tipo) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const rachas = get().rachas;
      const racha = rachas.find((r) => r.tipo === tipo);
      if (!racha) return;

      const hoy = new Date().toISOString().split('T')[0];
      const mejorRacha = Math.max(racha.mejor_racha_dias, racha.racha_actual_dias);

      const updates = {
        fecha_inicio_racha: hoy,
        racha_actual_dias: 0,
        mejor_racha_dias: mejorRacha,
        total_resets: racha.total_resets + 1,
        ultimo_reset: hoy,
      };

      // Optimistic
      set({
        rachas: rachas.map((r) => (r.tipo === tipo ? { ...r, ...updates } : r)),
      });

      const { error } = await supabase
        .from('addiction_streaks')
        .update(updates)
        .eq('id', racha.id);

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al resetear racha';
      logger.error('resetRacha:', message);
      await get().fetchRachas();
    }
  },

  iniciarRacha: async (tipo) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const hoy = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('addiction_streaks')
        .insert({
          user_id: userId,
          tipo,
          fecha_inicio_racha: hoy,
          racha_actual_dias: 0,
          mejor_racha_dias: 0,
          total_resets: 0,
        })
        .select('*')
        .single();

      if (error) throw error;
      set({ rachas: [...get().rachas, data as AddictionStreak] });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar racha';
      logger.error('iniciarRacha:', message);
    }
  },
}));
