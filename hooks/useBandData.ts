/**
 * useBandData.ts — Leer datos de Health Connect (Huawei Band 7)
 * Dependencias: healthConnect, supabase
 */

import { useCallback, useEffect, useState } from 'react';
import { readBandData, checkHealthConnectAvailable } from '@/lib/healthConnect';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { BandData } from '@/types/user.types';

export function useBandData() {
  const [data, setData] = useState<BandData | null>(null);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkHealthConnectAvailable().then(setAvailable);
  }, []);

  const fetchTodayData = useCallback(async () => {
    setLoading(true);
    try {
      const hoy = new Date().toISOString().split('T')[0];

      // Intentar leer de Health Connect
      const bandData = await readBandData(hoy);

      if (bandData) {
        setData(bandData);

        // Persistir en Supabase
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (userId) {
          await supabase.from('band_data').upsert(
            {
              user_id: userId,
              fecha: hoy,
              pasos: bandData.pasos,
              calorias_activas: bandData.calorias_activas,
              fc_promedio: bandData.fc_promedio,
              fc_max: bandData.fc_max,
              sueno_horas: bandData.sueno_horas,
              sueno_profundo_horas: bandData.sueno_profundo_horas,
            },
            { onConflict: 'user_id,fecha' },
          );
        }
      } else {
        // Cargar último dato guardado de Supabase
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (userId) {
          const { data: savedData } = await supabase
            .from('band_data')
            .select('*')
            .eq('user_id', userId)
            .eq('fecha', hoy)
            .single();

          if (savedData) {
            setData(savedData as BandData);
          }
        }
      }
    } catch (err) {
      logger.error('useBandData:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayData();
  }, [fetchTodayData]);

  return {
    data,
    available,
    loading,
    refetch: fetchTodayData,
  };
}
