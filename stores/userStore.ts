/**
 * userStore.ts — Store del perfil de usuario y configuración
 * Zustand como fuente de verdad, Supabase como persistencia
 * Dependencias: supabase, user.types
 */

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { UserProfile, OnboardingData } from '@/types/user.types';

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isOnboarded: boolean;

  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  isOnboarded: false,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (!userId) {
        set({ loading: false, profile: null, isOnboarded: false });
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        set({
          profile: data as UserProfile,
          isOnboarded: true,
          loading: false,
        });
      } else {
        set({ profile: null, isOnboarded: false, loading: false });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar perfil';
      logger.error('fetchProfile:', message);
      set({ error: message, loading: false });
    }
  },

  updateProfile: async (updates) => {
    const profile = get().profile;
    if (!profile) return;

    // Optimistic update
    set({ profile: { ...profile, ...updates, updated_at: new Date().toISOString() } });

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profile.id);

      if (error) throw error;
    } catch (err) {
      // Revert on error
      set({ profile });
      const message = err instanceof Error ? err.message : 'Error al actualizar perfil';
      logger.error('updateProfile:', message);
      set({ error: message });
    }
  },

  setProfile: (profile) => {
    set({ profile, isOnboarded: true, error: null });
  },

  clearProfile: () => {
    set({ profile: null, isOnboarded: false, error: null });
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ profile: null, isOnboarded: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
      logger.error('signOut:', message);
    }
  },
}));
