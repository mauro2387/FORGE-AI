/**
 * HabitRow.tsx — Fila de hábito con check/uncheck
 * Dependencias: NativeWind
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface HabitRowProps {
  nombre: string;
  completado: boolean;
  onToggle: () => void;
}

export function HabitRow({ nombre, completado, onToggle }: HabitRowProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      className={`
        flex-row items-center py-3 px-4 rounded-lg gap-3
        ${completado ? 'bg-olive/10' : 'bg-bg2'}
        border border-border
      `}
      accessibilityLabel={`${nombre}: ${completado ? 'completado' : 'pendiente'}`}
    >
      <View
        className={`
          w-6 h-6 rounded-md border-2 items-center justify-center
          ${completado ? 'bg-olive-l border-olive-l' : 'border-border'}
        `}
      >
        {completado && <Text className="text-white text-xs">✓</Text>}
      </View>

      <Text
        className={`
          flex-1 font-barlow text-base
          ${completado ? 'text-text line-through' : 'text-white'}
        `}
      >
        {nombre}
      </Text>
    </TouchableOpacity>
  );
}
