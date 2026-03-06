/**
 * MacroRing.tsx — Anillo visual de macros del día (SVG)
 * Dependencias: react-native-svg, NativeWind
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS } from '@/constants/theme';

interface MacroRingProps {
  consumido: number;
  objetivo: number;
  label: string;
  color: string;
  size?: number;
}

export function MacroRing({
  consumido,
  objetivo,
  label,
  color,
  size = 80,
}: MacroRingProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = objetivo > 0 ? Math.min(consumido / objetivo, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const restante = Math.max(objetivo - consumido, 0);

  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1c2030"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View
          style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: size, height: size }}
        >
          <Text style={{ fontFamily: FONTS.title, fontSize: 18, color: COLORS.white }}>{Math.round(consumido)}</Text>
        </View>
      </View>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>{Math.round(restante)} rest</Text>
    </View>
  );
}
