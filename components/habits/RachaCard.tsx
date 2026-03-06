/**
 * RachaCard.tsx — Card de racha de adicción con contador de días
 * Dependencias: Card, NativeWind
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { RachaFlame } from './RachaFlame';
import { COLORS, FONTS } from '@/constants/theme';
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          {esRachaActiva && <RachaFlame dias={diasActuales} />}

          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.white, textTransform: 'capitalize' }}>
              {racha.tipo.replace('_', ' ')}
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>
              Mejor racha: {racha.mejor_racha_dias} días
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: FONTS.title, fontSize: 30, color: COLORS.accent }}>{diasActuales}</Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>DÍAS</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onReset}
        style={{ marginTop: 12, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', borderRadius: 10 }}
        accessibilityLabel={`Resetear racha de ${racha.tipo}`}
      >
        <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: '#ef4444', textTransform: 'uppercase' }}>
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
