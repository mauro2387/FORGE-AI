/**
 * Card.tsx — Card base de FORGE (fondo bg2, borde border)
 * Dependencias: theme
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  noPadding?: boolean;
  style?: ViewStyle;
}

export function Card({ children, noPadding = false, style }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        noPadding ? undefined : styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0e1117',
    borderWidth: 1,
    borderColor: '#1e2433',
    borderRadius: 14,
  },
  padding: {
    padding: 16,
  },
});
