/**
 * RestTimer.tsx — Timer de descanso entre series
 * Dependencias: useTimer, Timer, NativeWind
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TimerDisplay } from '@/components/ui/Timer';
import { useTimer } from '@/hooks/useTimer';
import { COLORS, FONTS } from '@/constants/theme';

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
    <View style={{ backgroundColor: '#0c0e12', borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 24, alignItems: 'center', gap: 16 }}>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase', letterSpacing: 2 }}>
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

      <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.text, textAlign: 'center' }}>
        Preparate para la siguiente serie
      </Text>
    </View>
  );
}
