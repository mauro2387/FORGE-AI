/**
 * RestTimer.tsx — Timer de descanso entre series
 * Dependencias: useTimer, Timer, NativeWind
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TimerDisplay } from '@/components/ui/Timer';
import { useTimer } from '@/hooks/useTimer';

interface RestTimerProps {
  duracionSeg: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ duracionSeg, onComplete, onSkip }: RestTimerProps) {
  const timer = useTimer({
    duracionSeg,
    onComplete,
    autoStart: true,
    conSonido: true,
    conVibracion: true,
  });

  return (
    <View className="bg-bg2 border border-border rounded-2xl p-6 items-center gap-4">
      <Text className="text-text font-mono text-xs uppercase tracking-widest">
        Descanso
      </Text>

      <TimerDisplay
        formatTiempo={timer.formatTiempo}
        progreso={timer.progreso}
        corriendo={timer.corriendo}
        onStart={timer.iniciar}
        onPause={timer.pausar}
        onReset={timer.resetear}
        onSkip={onSkip}
      />

      <Text className="text-text font-barlow text-sm text-center">
        Preparate para la siguiente serie
      </Text>
    </View>
  );
}
