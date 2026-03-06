/**
 * ForgeMessage.tsx — Mensaje diario de FORGE IA
 * Dependencias: Card
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';

interface ForgeMessageProps {
  mensaje: string | null;
  tareaMañana: string | null;
}

export function ForgeMessage({ mensaje, tareaMañana }: ForgeMessageProps) {
  if (!mensaje && !tareaMañana) return null;

  return (
    <Card className="border-accent/30">
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-accent font-bebas text-lg">FORGE</Text>
        <View className="flex-1 h-px bg-accent/20" />
      </View>

      {mensaje && (
        <Text className="text-text-b font-barlow text-base leading-5 mb-2">
          {mensaje}
        </Text>
      )}

      {tareaMañana && (
        <View className="bg-accent/10 border border-accent/20 rounded-lg p-3 mt-1">
          <Text className="text-text font-mono text-xs uppercase mb-1">
            Tarea de hoy
          </Text>
          <Text className="text-white font-barlow-medium text-base">
            {tareaMañana}
          </Text>
        </View>
      )}
    </Card>
  );
}
