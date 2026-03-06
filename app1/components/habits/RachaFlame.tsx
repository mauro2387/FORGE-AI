/**
 * RachaFlame.tsx — Animación de llama para rachas activas
 * Dependencias: Reanimated
 */

import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface RachaFlameProps {
  dias: number;
}

export function RachaFlame({ dias }: RachaFlameProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const flameSize = dias >= 30 ? 32 : dias >= 7 ? 28 : 24;

  return (
    <Animated.View style={animatedStyle}>
      <Text style={{ fontSize: flameSize }}>
        {dias >= 30 ? '🔥' : dias >= 7 ? '🔥' : '🕯️'}
      </Text>
    </Animated.View>
  );
}
