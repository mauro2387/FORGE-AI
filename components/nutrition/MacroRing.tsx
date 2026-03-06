/**
 * MacroRing.tsx — Anillo visual de macros del día (SVG)
 * Dependencias: react-native-svg, NativeWind
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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
    <View className="items-center gap-1">
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
          className="absolute items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Text className="text-white font-bebas text-lg">{Math.round(consumido)}</Text>
        </View>
      </View>
      <Text className="text-text font-mono text-xs uppercase">{label}</Text>
      <Text className="text-text font-mono text-xs">{Math.round(restante)} rest</Text>
    </View>
  );
}
