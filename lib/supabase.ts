/**
 * supabase.ts — Cliente Supabase configurado con auth persistente
 * Usa react-native-mmkv para storage rápido
 * Dependencias: @supabase/supabase-js, react-native-mmkv, config
 */

import { createClient } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv';
import { CONFIG } from '@/constants/config';

const storage = new MMKV({ id: 'forge-auth' });

const mmkvStorageAdapter = {
  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.delete(key);
  },
};

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
  auth: {
    storage: mmkvStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
