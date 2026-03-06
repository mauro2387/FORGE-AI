/**
 * Avatar.tsx — Avatar de usuario con fallback de iniciales
 * Dependencias: theme
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

export interface AvatarProps {
  uri?: string | null;
  nombre?: string;
  name?: string;
  size?: number;
}

export function Avatar({ uri, nombre, name, size = 48 }: AvatarProps) {
  if (!nombre && name) nombre = name;
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
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: COLORS.accent,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: COLORS.olive,
        borderWidth: 2,
        borderColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: COLORS.white, fontFamily: FONTS.bebas, fontSize: size * 0.4 }}>
        {initials}
      </Text>
    </View>
  );
}
