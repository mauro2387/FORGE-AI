/**
 * DiaResumen.tsx — Resumen del día en el dashboard
 * Muestra estado de entrenamiento, comidas, hábitos
 * Dependencias: Card, ProgressBar
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { COLORS, FONTS } from '@/constants/theme';
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
      <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
        Resumen del día
      </Text>

      {/* Entrenamiento */}
      <TouchableOpacity
        onPress={onEntrenar}
        disabled={workoutCompletado || !diaPlan}
        activeOpacity={0.7}
        style={{
          padding: 12,
          borderRadius: 10,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: workoutCompletado ? 'rgba(87, 128, 80, 0.3)' : 'rgba(196, 160, 64, 0.3)',
          backgroundColor: workoutCompletado ? 'rgba(61, 79, 58, 0.1)' : 'rgba(196, 160, 64, 0.05)',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase' }}>
              Entrenamiento
            </Text>
            <Text style={{ fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.white }}>
              {diaPlan?.tipo === 'DESCANSO'
                ? 'Día de descanso'
                : diaPlan?.tipo ?? 'Sin plan'}
            </Text>
          </View>
          {workoutCompletado ? (
            <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: '#587050' }}>✓ HECHO</Text>
          ) : diaPlan?.tipo !== 'DESCANSO' ? (
            <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.accent }}>IR →</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Calorías */}
      <View style={{ padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase' }}>Calorías</Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.accent }}>
            {Math.round(caloriasConsumidas)}/{caloriasObjetivo}
          </Text>
        </View>
        <ProgressBar
          progress={caloriasObjetivo > 0 ? caloriasConsumidas / caloriasObjetivo : 0}
          height={4}
        />
      </View>

      {/* Hábitos */}
      <View style={{ padding: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase' }}>Hábitos</Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: '#587050' }}>
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
