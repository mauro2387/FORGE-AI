/**
 * RachaCard.tsx — Card de racha de adicción con contador de días
 * Dependencias: Card, NativeWind
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { RachaFlame } from './RachaFlame';
import type { AddictionStreak } from '@/types/plan.types';

interface RachaCardProps {
  racha: AddictionStreak;
  onReset: () => void;
}

export function RachaCard({ racha, onReset }: RachaCardProps) {
  const diasActuales = calcularDiasDesde(racha.fecha_inicio_racha);
  const esRachaActiva = diasActuales > 0;

  return (
    <Card>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          {esRachaActiva && <RachaFlame dias={diasActuales} />}

          <View className="flex-1">
            <Text className="text-white font-barlow-bold text-base capitalize">
              {racha.tipo.replace('_', ' ')}
            </Text>
            <Text className="text-text font-mono text-xs">
              Mejor racha: {racha.mejor_racha_dias} días
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-accent font-bebas text-3xl">{diasActuales}</Text>
          <Text className="text-text font-mono text-xs">DÍAS</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onReset}
        className="mt-3 py-2 items-center border border-danger/30 rounded-lg"
        accessibilityLabel={`Resetear racha de ${racha.tipo}`}
      >
        <Text className="text-danger font-mono text-xs uppercase">
          Recaí hoy
        </Text>
      </TouchableOpacity>
    </Card>
  );
}

function calcularDiasDesde(fechaInicio: string): number {
  const inicio = new Date(fechaInicio);
  const hoy = new Date();
  const diff = hoy.getTime() - inicio.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}
