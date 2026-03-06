/**
 * Avatar.tsx — Avatar de usuario con fallback de iniciales
 * Dependencias: NativeWind
 */

import React from 'react';
import { View, Text, Image } from 'react-native';

interface AvatarProps {
  uri?: string | null;
  nombre?: string;
  size?: number;
}

export function Avatar({ uri, nombre, size = 48 }: AvatarProps) {
  const initials = nombre
    ? nombre
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'F';

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className="border-2 border-accent"
      />
    );
  }

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="bg-olive border-2 border-accent items-center justify-center"
    >
      <Text className="text-white font-bebas" style={{ fontSize: size * 0.4 }}>
        {initials}
      </Text>
    </View>
  );
}
