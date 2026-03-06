/**
 * WorkoutSummary.tsx — Resumen al finalizar el entrenamiento
 * Dependencias: Card, workout.types
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { EjercicioCompletado } from '@/types/workout.types';

interface WorkoutSummaryProps {
  ejercicios: EjercicioCompletado[];
  duracionMin: number;
  onClose: () => void;
}

export function WorkoutSummary({
  ejercicios,
  duracionMin,
  onClose,
}: WorkoutSummaryProps) {
  const completados = ejercicios.filter((e) => e.completado).length;
  const totalSeries = ejercicios.reduce((acc, e) => acc + e.series.length, 0);
  const totalReps = ejercicios.reduce(
    (acc, e) => acc + e.series.reduce((s, serie) => s + serie.reps_hechas, 0),
    0,
  );

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16 }}>
      <View className="items-center gap-2 mb-6">
        <Text className="text-accent font-bebas text-4xl tracking-wider">
          ENTRENAMIENTO COMPLETADO
        </Text>
        <Text className="text-text font-mono text-sm">
          Duración: {duracionMin} minutos
        </Text>
      </View>

      <View className="flex-row gap-4 mb-6">
        <Card className="flex-1 items-center">
          <Text className="text-accent font-bebas text-3xl">{completados}</Text>
          <Text className="text-text font-mono text-xs">EJERCICIOS</Text>
        </Card>
        <Card className="flex-1 items-center">
          <Text className="text-accent font-bebas text-3xl">{totalSeries}</Text>
          <Text className="text-text font-mono text-xs">SERIES</Text>
        </Card>
        <Card className="flex-1 items-center">
          <Text className="text-accent font-bebas text-3xl">{totalReps}</Text>
          <Text className="text-text font-mono text-xs">REPS TOTAL</Text>
        </Card>
      </View>

      {ejercicios.map((ej, i) => (
        <Card key={i} className="mb-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-barlow-medium text-base flex-1">
              {ej.nombre}
            </Text>
            <Text className={ej.completado ? 'text-olive-l font-mono text-sm' : 'text-danger font-mono text-sm'}>
              {ej.completado ? '✓ COMPLETO' : '✗ INCOMPLETO'}
            </Text>
          </View>
          <View className="flex-row gap-4 mt-2">
            {ej.series.map((s, j) => (
              <View key={j} className="items-center">
                <Text className="text-text font-mono text-xs">S{s.serie_numero}</Text>
                <Text className="text-text-b font-mono text-sm">
                  {s.reps_hechas}
                  {s.peso_usado ? `×${s.peso_usado}kg` : ''}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      ))}

      <View className="mt-6">
        <Button title="CERRAR" onPress={onClose} fullWidth />
      </View>
    </ScrollView>
  );
}
