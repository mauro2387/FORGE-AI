/**
 * WorkoutSummary.tsx — Resumen al finalizar el entrenamiento
 * Dependencias: Card, workout.types
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { COLORS, FONTS } from '@/constants/theme';
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
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Text style={{ fontFamily: FONTS.title, fontSize: 36, color: COLORS.accent, letterSpacing: 2 }}>
          ENTRENAMIENTO COMPLETADO
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.text }}>
          Duración: {duracionMin} minutos
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
        <View style={{ flex: 1 }}>
          <Card style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: FONTS.title, fontSize: 30, color: COLORS.accent }}>{completados}</Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>EJERCICIOS</Text>
          </Card>
        </View>
        <View style={{ flex: 1 }}>
          <Card style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: FONTS.title, fontSize: 30, color: COLORS.accent }}>{totalSeries}</Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>SERIES</Text>
          </Card>
        </View>
        <View style={{ flex: 1 }}>
          <Card style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: FONTS.title, fontSize: 30, color: COLORS.accent }}>{totalReps}</Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>REPS TOTAL</Text>
          </Card>
        </View>
      </View>

      {ejercicios.map((ej, i) => (
        <View key={i} style={{ marginBottom: 8 }}>
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.white, flex: 1 }}>
                {ej.nombre}
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: ej.completado ? '#587050' : '#ef4444' }}>
                {ej.completado ? '✓ COMPLETO' : '✗ INCOMPLETO'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
              {ej.series.map((s, j) => (
                <View key={j} style={{ alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>S{s.serie_numero}</Text>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.textB }}>
                    {s.reps_hechas}
                    {s.peso_usado ? `×${s.peso_usado}kg` : ''}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      ))}

      <View style={{ marginTop: 24 }}>
        <Button title="CERRAR" onPress={onClose} fullWidth />
      </View>
    </ScrollView>
  );
}
