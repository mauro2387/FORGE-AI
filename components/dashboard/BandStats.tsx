/**
 * BandStats.tsx — Stats del Huawei Band
 * Dependencias: Card, user.types
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import type { BandData } from '@/types/user.types';

interface BandStatsProps {
  data: BandData | null;
  available: boolean;
}

export function BandStats({ data, available }: BandStatsProps) {
  if (!available && !data) {
    return (
      <Card>
        <Text className="text-text font-mono text-xs uppercase tracking-widest mb-2">
          Huawei Band 7
        </Text>
        <Text className="text-text font-barlow text-sm">
          Conectá Health Connect para ver tus datos
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <Text className="text-text font-mono text-xs uppercase tracking-widest mb-3">
        Huawei Band 7
      </Text>

      <View className="flex-row gap-4">
        <View className="flex-1 items-center">
          <Text className="text-accent font-bebas text-2xl">
            {data?.pasos?.toLocaleString() ?? '—'}
          </Text>
          <Text className="text-text font-mono text-xs">PASOS</Text>
        </View>

        <View className="flex-1 items-center">
          <Text className="text-blue font-bebas text-2xl">
            {data?.fc_promedio ?? '—'}
          </Text>
          <Text className="text-text font-mono text-xs">FC PROM</Text>
        </View>

        <View className="flex-1 items-center">
          <Text className="text-olive-l font-bebas text-2xl">
            {data?.sueno_horas ? `${data.sueno_horas.toFixed(1)}h` : '—'}
          </Text>
          <Text className="text-text font-mono text-xs">SUEÑO</Text>
        </View>

        <View className="flex-1 items-center">
          <Text className="text-accent font-bebas text-2xl">
            {data?.calorias_activas ?? '—'}
          </Text>
          <Text className="text-text font-mono text-xs">CAL ACT</Text>
        </View>
      </View>
    </Card>
  );
}
