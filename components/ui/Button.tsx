/**
 * Button.tsx — Botón principal de FORGE
 * Soporte: filled, outline, ghost, danger
 * Dependencias: theme
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

const VARIANT_BG: Record<string, string> = {
  filled: COLORS.accent,
  outline: 'transparent',
  ghost: 'transparent',
  danger: COLORS.danger,
};

const VARIANT_TEXT_COLOR: Record<string, string> = {
  filled: COLORS.bg,
  outline: COLORS.accent,
  ghost: COLORS.textB,
  danger: COLORS.white,
};

const VARIANT_BORDER: Record<string, string> = {
  filled: COLORS.accent,
  outline: COLORS.accent,
  ghost: 'transparent',
  danger: COLORS.danger,
};

const SIZE_PY: Record<string, number> = { sm: 10, md: 14, lg: 18 };
const SIZE_PX: Record<string, number> = { sm: 16, md: 24, lg: 32 };
const SIZE_FONT: Record<string, number> = { sm: 13, md: 15, lg: 17 };

export function Button({
  title,
  onPress,
  variant = 'filled',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  accessibilityLabel,
}: ButtonProps) {
  const resolvedVariant = variant === 'primary' ? 'filled' : variant;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      style={[
        styles.base,
        {
          backgroundColor: VARIANT_BG[resolvedVariant],
          borderColor: VARIANT_BORDER[resolvedVariant],
          borderWidth: resolvedVariant === 'outline' ? 1.5 : 0,
          paddingVertical: SIZE_PY[size],
          paddingHorizontal: SIZE_PX[size],
          opacity: isDisabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={resolvedVariant === 'filled' ? COLORS.bg : COLORS.accent}
        />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              styles.text,
              {
                color: VARIANT_TEXT_COLOR[resolvedVariant],
                fontSize: SIZE_FONT[size],
                fontFamily: FONTS.barlowBold,
              },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});
