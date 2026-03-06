/**
 * SerieRow.tsx — Fila de una serie (reps, peso, completado)
 * Dependencias: NativeWind, workout.types
 */

import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';
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
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 16,
        backgroundColor: esActual ? 'rgba(196, 160, 64, 0.1)' : COLORS.bg,
        borderWidth: esActual ? 1 : 0,
        borderColor: esActual ? 'rgba(196, 160, 64, 0.3)' : 'transparent',
        opacity: completada ? 0.6 : 1,
      }}
    >
      <View style={{ width: 32 }}>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.text }}>S{serieNumero}</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>OBJ</Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.textB }}>{repsObjetivo}</Text>
        </View>

        {pesoObjetivo !== null && (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>KG</Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.textB }}>{pesoObjetivo}</Text>
          </View>
        )}

        {serie && (
          <>
            <Text style={{ color: COLORS.border }}>→</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>HECHO</Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: serie.reps_hechas >= serie.reps_objetivo ? '#587050' : '#ef4444' }}>
                {serie.reps_hechas}
              </Text>
            </View>
            {serie.peso_usado !== null && (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>KG</Text>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.accent }}>{serie.peso_usado}</Text>
              </View>
            )}
          </>
        )}
      </View>

      <View style={{ width: 32, alignItems: 'center' }}>
        {completada ? (
          <Text style={{ color: '#587050', fontSize: 18 }}>✓</Text>
        ) : esActual ? (
          <Text style={{ color: COLORS.accent, fontSize: 18 }}>●</Text>
        ) : (
          <Text style={{ color: COLORS.border, fontSize: 18 }}>○</Text>
        )}
      </View>
    </View>
  );
}
