/**
 * supabase.ts — Cliente Supabase configurado con auth persistente
 * Usa react-native-mmkv para storage rápido en nativo, fallback para web
 * Dependencias: @supabase/supabase-js, react-native-mmkv, config
 */

import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { CONFIG } from '@/constants/config';

let mmkvStorageAdapter: {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MMKV } = require('react-native-mmkv');
  const storage = new MMKV({ id: 'forge-auth' });
  mmkvStorageAdapter = {
    getItem: (key: string): string | null => storage.getString(key) ?? null,
    setItem: (key: string, value: string): void => storage.set(key, value),
    removeItem: (key: string): void => storage.delete(key),
  };
} else {
  // Web fallback using localStorage
  mmkvStorageAdapter = {
    getItem: (key: string): string | null => {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    setItem: (key: string, value: string): void => {
      try { localStorage.setItem(key, value); } catch { /* noop */ }
    },
    removeItem: (key: string): void => {
      try { localStorage.removeItem(key); } catch { /* noop */ }
    },
  };
}

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
  auth: {
    storage: mmkvStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
