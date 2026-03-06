/**
 * Badge.tsx — Badge/Tag de estado
 * Dependencias: theme
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'accent' | 'olive' | 'danger' | 'blue' | 'neutral';
}

const BADGE_BG: Record<string, string> = {
  accent: 'rgba(196,160,64,0.15)',
  olive: 'rgba(61,79,58,0.15)',
  danger: 'rgba(146,32,32,0.15)',
  blue: 'rgba(42,122,154,0.15)',
  neutral: '#1e2433',
};

const BADGE_BORDER: Record<string, string> = {
  accent: COLORS.accent,
  olive: COLORS.oliveL,
  danger: COLORS.danger,
  blue: COLORS.blue,
  neutral: '#1e2433',
};

const BADGE_TEXT_COLOR: Record<string, string> = {
  accent: COLORS.accent,
  olive: COLORS.oliveL,
  danger: COLORS.danger,
  blue: COLORS.blue,
  neutral: COLORS.text,
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: BADGE_BG[variant],
          borderColor: BADGE_BORDER[variant],
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: BADGE_TEXT_COLOR[variant] },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    textTransform: 'uppercase',
  },
});
