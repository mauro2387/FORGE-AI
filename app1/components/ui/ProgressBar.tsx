/**
 * ProgressBar.tsx — Barra de progreso animada
 * Dependencias: NativeWind, Reanimated
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  progress,
  color = '#c4a040',
  height = 8,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(Math.max(progress, 0), 1) * 100, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: color,
  }));

  return (
    <View className="gap-1">
      {showLabel && (
        <View className="flex-row justify-between">
          <Text className="text-text font-mono text-xs">
            {label ?? 'Progreso'}
          </Text>
          <Text className="text-text-b font-mono text-xs">
            {Math.round(progress * 100)}%
          </Text>
        </View>
      )}
      <View
        className="w-full bg-border rounded-full overflow-hidden"
        style={{ height }}
      >
        <Animated.View
          className="h-full rounded-full"
          style={animatedStyle}
        />
      </View>
    </View>
  );
}
