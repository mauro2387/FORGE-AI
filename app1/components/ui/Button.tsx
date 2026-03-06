/**
 * Button.tsx — Botón principal de FORGE
 * Soporte: filled, outline, ghost, danger
 * Dependencias: NativeWind, theme
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

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
  className?: string;
}

const VARIANT_STYLES = {
  filled: 'bg-accent',
  outline: 'border border-accent bg-transparent',
  ghost: 'bg-transparent',
  danger: 'bg-danger',
} as const;

const VARIANT_TEXT = {
  filled: 'text-bg font-barlow-bold',
  outline: 'text-accent font-barlow-bold',
  ghost: 'text-text-b font-barlow-medium',
  danger: 'text-white font-barlow-bold',
} as const;

const SIZE_STYLES = {
  sm: 'py-2 px-4',
  md: 'py-3 px-6',
  lg: 'py-4 px-8',
} as const;

const SIZE_TEXT = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
} as const;

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
  className,
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
      className={`
        flex-row items-center justify-center rounded-lg
        ${VARIANT_STYLES[resolvedVariant]}
        ${SIZE_STYLES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        ${className ?? ''}
      `}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={resolvedVariant === 'filled' ? '#060708' : '#c4a040'}
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text
            className={`
              ${VARIANT_TEXT[resolvedVariant]}
              ${SIZE_TEXT[size]}
              tracking-wider uppercase
            `}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
