/**
 * EjercicioCard.tsx — Card de ejercicio con GIF y series
 * Dependencias: ExerciseGif, Badge, workout.types
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExerciseGif } from './ExerciseGif';
import { COLORS, FONTS } from '@/constants/theme';
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
        style={{
          ...(isActual ? { borderColor: COLORS.accent } : {}),
          ...(completado ? { opacity: 0.6 } : {}),
        }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <ExerciseGif
            exerciseDbId={ejercicio.exercise_db_id}
            nombre={ejercicio.nombre}
            size={80}
          />

          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>
                #{index + 1}
              </Text>
              {completado && <Badge label="✓" variant="olive" />}
              {isActual && !completado && <Badge label="ACTIVO" variant="accent" />}
            </View>

            <Text style={{ fontFamily: FONTS.bodyBold, fontSize: 18, color: COLORS.white }}>
              {ejercicio.nombre}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.accent }}>
                {ejercicio.series}×{ejercicio.reps}
              </Text>
              {ejercicio.peso_kg !== null && (
                <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.textB }}>
                  {ejercicio.peso_kg}kg
                </Text>
              )}
              {ejercicio.es_isometrico && ejercicio.tiempo_seg && (
                <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: '#2a7a9a' }}>
                  {ejercicio.tiempo_seg}s
                </Text>
              )}
              <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.text }}>
                ⏱ {ejercicio.descanso_seg}s rest
              </Text>
            </View>

            {ejercicio.notas && (
              <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.text, marginTop: 4 }} numberOfLines={2}>
                {ejercicio.notas}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
