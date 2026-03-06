/**
 * Timer.tsx — Display de timer con sonido y vibración
 * Dependencias: useTimer, NativeWind
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProgressBar } from './ProgressBar';

interface TimerDisplayProps {
  formatTiempo: string;
  progreso: number;
  corriendo: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip?: () => void;
  label?: string;
}

export function TimerDisplay({
  formatTiempo,
  progreso,
  corriendo,
  onStart,
  onPause,
  onReset,
  onSkip,
  label,
}: TimerDisplayProps) {
  return (
    <View className="items-center gap-4">
      {label && (
        <Text className="text-text font-mono text-xs uppercase tracking-widest">
          {label}
        </Text>
      )}

      <Text className="text-accent font-bebas text-6xl tracking-wider">
        {formatTiempo}
      </Text>

      <View className="w-full px-8">
        <ProgressBar progress={progreso} height={4} />
      </View>

      <View className="flex-row gap-4">
        {corriendo ? (
          <TouchableOpacity
            onPress={onPause}
            className="bg-border px-6 py-2 rounded-lg"
            accessibilityLabel="Pausar timer"
          >
            <Text className="text-text-b font-mono text-sm uppercase">Pausa</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onStart}
            className="bg-accent px-6 py-2 rounded-lg"
            accessibilityLabel="Iniciar timer"
          >
            <Text className="text-bg font-mono text-sm uppercase">Iniciar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onReset}
          className="bg-border px-4 py-2 rounded-lg"
          accessibilityLabel="Resetear timer"
        >
          <Text className="text-text font-mono text-sm uppercase">Reset</Text>
        </TouchableOpacity>

        {onSkip && (
          <TouchableOpacity
            onPress={onSkip}
            className="bg-transparent border border-border px-4 py-2 rounded-lg"
            accessibilityLabel="Saltar descanso"
          >
            <Text className="text-text font-mono text-sm uppercase">Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
