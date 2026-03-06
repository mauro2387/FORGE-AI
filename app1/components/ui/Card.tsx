/**
 * Card.tsx — Card base de FORGE (fondo bg2, borde border)
 * Dependencias: NativeWind
 */

import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
  return (
    <View
      className={`
        bg-bg2 border border-border rounded-xl
        ${noPadding ? '' : 'p-4'}
        ${className}
      `}
    >
      {children}
    </View>
  );
}
