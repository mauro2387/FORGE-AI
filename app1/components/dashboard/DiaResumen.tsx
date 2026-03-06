/**
 * DiaResumen.tsx — Resumen del día en el dashboard
 * Muestra estado de entrenamiento, comidas, hábitos
 * Dependencias: Card, ProgressBar
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { DiaPlan } from '@/types/workout.types';

interface DiaResumenProps {
  diaPlan: DiaPlan | null;
  workoutCompletado: boolean;
  caloriasConsumidas: number;
  caloriasObjetivo: number;
  habitosCompletados: number;
  habitosTotal: number;
  onEntrenar: () => void;
}

export function DiaResumen({
  diaPlan,
  workoutCompletado,
  caloriasConsumidas,
  caloriasObjetivo,
  habitosCompletados,
  habitosTotal,
  onEntrenar,
}: DiaResumenProps) {
  return (
    <Card>
      <Text className="text-text font-mono text-xs uppercase tracking-widest mb-3">
        Resumen del día
      </Text>

      {/* Entrenamiento */}
      <TouchableOpacity
        onPress={onEntrenar}
        disabled={workoutCompletado || !diaPlan}
        activeOpacity={0.7}
        className={`
          p-3 rounded-lg mb-2 border
          ${workoutCompletado ? 'border-olive-l/30 bg-olive/10' : 'border-accent/30 bg-accent/5'}
        `}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-text font-mono text-xs uppercase">
              Entrenamiento
            </Text>
            <Text className="text-white font-barlow-medium text-base">
              {diaPlan?.tipo === 'DESCANSO'
                ? 'Día de descanso'
                : diaPlan?.tipo ?? 'Sin plan'}
            </Text>
          </View>
          {workoutCompletado ? (
            <Text className="text-olive-l font-mono text-sm">✓ HECHO</Text>
          ) : diaPlan?.tipo !== 'DESCANSO' ? (
            <Text className="text-accent font-mono text-sm">IR →</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Calorías */}
      <View className="p-3 rounded-lg mb-2 border border-border">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-text font-mono text-xs uppercase">Calorías</Text>
          <Text className="text-accent font-mono text-sm">
            {Math.round(caloriasConsumidas)}/{caloriasObjetivo}
          </Text>
        </View>
        <ProgressBar
          progress={caloriasObjetivo > 0 ? caloriasConsumidas / caloriasObjetivo : 0}
          height={4}
        />
      </View>

      {/* Hábitos */}
      <View className="p-3 rounded-lg border border-border">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-text font-mono text-xs uppercase">Hábitos</Text>
          <Text className="text-olive-l font-mono text-sm">
            {habitosCompletados}/{habitosTotal}
          </Text>
        </View>
        <ProgressBar
          progress={habitosTotal > 0 ? habitosCompletados / habitosTotal : 0}
          color="#587050"
          height={4}
        />
      </View>
    </Card>
  );
}
