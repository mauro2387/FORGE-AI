/**
 * EjercicioCard.tsx — Card de ejercicio con GIF y series
 * Dependencias: ExerciseGif, Badge, workout.types
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExerciseGif } from './ExerciseGif';
import type { EjercicioPlan } from '@/types/workout.types';

export interface EjercicioCardProps {
  ejercicio: EjercicioPlan;
  index: number;
  isActual?: boolean;
  completado?: boolean;
  onPress?: () => void;
  activo?: boolean;
}

export function EjercicioCard({
  ejercicio,
  index,
  isActual: isActualProp,
  completado = false,
  onPress,
  activo,
}: EjercicioCardProps) {
  const isActual = isActualProp ?? activo ?? false;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
      <Card
        className={`
          ${isActual ? 'border-accent' : ''}
          ${completado ? 'opacity-60' : ''}
        `}
      >
        <View className="flex-row gap-3">
          <ExerciseGif
            exerciseDbId={ejercicio.exercise_db_id}
            nombre={ejercicio.nombre}
            size={80}
          />

          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-text font-mono text-xs">
                #{index + 1}
              </Text>
              {completado && <Badge label="✓" variant="olive" />}
              {isActual && !completado && <Badge label="ACTIVO" variant="accent" />}
            </View>

            <Text className="text-white font-barlow-bold text-lg">
              {ejercicio.nombre}
            </Text>

            <View className="flex-row gap-3">
              <Text className="text-accent font-mono text-sm">
                {ejercicio.series}×{ejercicio.reps}
              </Text>
              {ejercicio.peso_kg !== null && (
                <Text className="text-text-b font-mono text-sm">
                  {ejercicio.peso_kg}kg
                </Text>
              )}
              {ejercicio.es_isometrico && ejercicio.tiempo_seg && (
                <Text className="text-blue font-mono text-sm">
                  {ejercicio.tiempo_seg}s
                </Text>
              )}
              <Text className="text-text font-mono text-sm">
                ⏱ {ejercicio.descanso_seg}s rest
              </Text>
            </View>

            {ejercicio.notas && (
              <Text className="text-text font-barlow text-sm mt-1" numberOfLines={2}>
                {ejercicio.notas}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
