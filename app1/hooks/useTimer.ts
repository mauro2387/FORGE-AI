/**
 * useTimer.ts — Timer reutilizable con sonido y vibración
 * Dependencias: expo-av, expo-haptics
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

interface UseTimerOptions {
  duracionSeg: number;
  onComplete?: () => void;
  autoStart?: boolean;
  conSonido?: boolean;
  conVibracion?: boolean;
}

interface UseTimerReturn {
  segundosRestantes: number;
  corriendo: boolean;
  progreso: number;
  iniciar: () => void;
  pausar: () => void;
  resetear: () => void;
  formatTiempo: string;
}

export function useTimer({
  duracionSeg,
  onComplete,
  autoStart = false,
  conSonido = true,
  conVibracion = true,
}: UseTimerOptions): UseTimerReturn {
  const [segundosRestantes, setSegundosRestantes] = useState(duracionSeg);
  const [corriendo, setCorriendo] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const limpiarInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const playBeep = useCallback(async () => {
    try {
      if (conSonido) {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/beep.mp3'),
        );
        soundRef.current = sound;
        await sound.playAsync();
      }
      if (conVibracion) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      // Silenciar errores de audio
      if (conVibracion) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    }
  }, [conSonido, conVibracion]);

  useEffect(() => {
    if (!corriendo) {
      limpiarInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          limpiarInterval();
          setCorriendo(false);
          playBeep();
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return limpiarInterval;
  }, [corriendo, limpiarInterval, onComplete, playBeep]);

  useEffect(() => {
    return () => {
      limpiarInterval();
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, [limpiarInterval]);

  const iniciar = useCallback(() => setCorriendo(true), []);
  const pausar = useCallback(() => setCorriendo(false), []);
  const resetear = useCallback(() => {
    setCorriendo(false);
    setSegundosRestantes(duracionSeg);
  }, [duracionSeg]);

  const progreso = duracionSeg > 0 ? (duracionSeg - segundosRestantes) / duracionSeg : 0;

  const minutos = Math.floor(segundosRestantes / 60);
  const segs = segundosRestantes % 60;
  const formatTiempo = `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;

  return {
    segundosRestantes,
    corriendo,
    progreso,
    iniciar,
    pausar,
    resetear,
    formatTiempo,
  };
}
