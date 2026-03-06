/**
 * Badge.tsx — Badge/Tag de estado
 * Dependencias: NativeWind
 */

import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'accent' | 'olive' | 'danger' | 'blue' | 'neutral';
}

const BADGE_STYLES = {
  accent: 'bg-accent/20 border-accent',
  olive: 'bg-olive/20 border-olive-l',
  danger: 'bg-danger/20 border-danger',
  blue: 'bg-blue/20 border-blue',
  neutral: 'bg-border border-border',
} as const;

const BADGE_TEXT = {
  accent: 'text-accent',
  olive: 'text-olive-l',
  danger: 'text-danger',
  blue: 'text-blue',
  neutral: 'text-text',
} as const;

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <View className={`border rounded-full px-3 py-1 ${BADGE_STYLES[variant]}`}>
      <Text className={`font-mono text-xs uppercase ${BADGE_TEXT[variant]}`}>
        {label}
      </Text>
    </View>
  );
}
