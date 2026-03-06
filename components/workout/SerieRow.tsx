/**
 * SerieRow.tsx — Fila de una serie (reps, peso, completado)
 * Dependencias: NativeWind, workout.types
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { SerieCompletada } from '@/types/workout.types';

interface SerieRowProps {
  serieNumero: number;
  serie: SerieCompletada | null;
  repsObjetivo: string;
  pesoObjetivo: number | null;
  esActual: boolean;
}

export function SerieRow({
  serieNumero,
  serie,
  repsObjetivo,
  pesoObjetivo,
  esActual,
}: SerieRowProps) {
  const completada = serie?.completada ?? false;

  return (
    <View
      className={`
        flex-row items-center py-3 px-4 rounded-lg gap-4
        ${esActual ? 'bg-accent/10 border border-accent/30' : 'bg-bg'}
        ${completada ? 'opacity-60' : ''}
      `}
    >
      <View className="w-8">
        <Text className="text-text font-mono text-sm">S{serieNumero}</Text>
      </View>

      <View className="flex-1 flex-row items-center gap-4">
        <View className="items-center">
          <Text className="text-text font-mono text-xs">OBJ</Text>
          <Text className="text-text-b font-mono text-sm">{repsObjetivo}</Text>
        </View>

        {pesoObjetivo !== null && (
          <View className="items-center">
            <Text className="text-text font-mono text-xs">KG</Text>
            <Text className="text-text-b font-mono text-sm">{pesoObjetivo}</Text>
          </View>
        )}

        {serie && (
          <>
            <Text className="text-border">→</Text>
            <View className="items-center">
              <Text className="text-text font-mono text-xs">HECHO</Text>
              <Text className={`font-mono text-sm ${serie.reps_hechas >= serie.reps_objetivo ? 'text-olive-l' : 'text-danger'}`}>
                {serie.reps_hechas}
              </Text>
            </View>
            {serie.peso_usado !== null && (
              <View className="items-center">
                <Text className="text-text font-mono text-xs">KG</Text>
                <Text className="text-accent font-mono text-sm">{serie.peso_usado}</Text>
              </View>
            )}
          </>
        )}
      </View>

      <View className="w-8 items-center">
        {completada ? (
          <Text className="text-olive-l text-lg">✓</Text>
        ) : esActual ? (
          <Text className="text-accent text-lg">●</Text>
        ) : (
          <Text className="text-border text-lg">○</Text>
        )}
      </View>
    </View>
  );
}
