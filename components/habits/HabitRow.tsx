/**
 * HabitRow.tsx — Fila de hábito con check/uncheck
 * Dependencias: NativeWind
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

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
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 12,
        backgroundColor: completado ? 'rgba(61, 79, 58, 0.1)' : '#0c0e12',
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
      accessibilityLabel={`${nombre}: ${completado ? 'completado' : 'pendiente'}`}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: completado ? '#587050' : 'transparent',
          borderColor: completado ? '#587050' : COLORS.border,
        }}
      >
        {completado && <Text style={{ color: COLORS.white, fontSize: 12 }}>✓</Text>}
      </View>

      <Text
        style={{
          flex: 1,
          fontFamily: FONTS.body,
          fontSize: 16,
          color: completado ? COLORS.text : COLORS.white,
          textDecorationLine: completado ? 'line-through' : 'none',
        }}
      >
        {nombre}
      </Text>
    </TouchableOpacity>
  );
}
