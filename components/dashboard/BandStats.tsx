/**
 * BandStats.tsx — Stats del Huawei Band
 * Dependencias: Card, user.types
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { COLORS, FONTS } from '@/constants/theme';
import type { BandData } from '@/types/user.types';

interface BandStatsProps {
  data: BandData | null;
  available: boolean;
}

export function BandStats({ data, available }: BandStatsProps) {
  if (!available && !data) {
    return (
      <Card>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Huawei Band 7
        </Text>
        <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.text }}>
          Conectá Health Connect para ver tus datos
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
        Huawei Band 7
      </Text>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.title, fontSize: 24, color: COLORS.accent }}>
            {data?.pasos?.toLocaleString() ?? '—'}
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>PASOS</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.title, fontSize: 24, color: '#2a7a9a' }}>
            {data?.fc_promedio ?? '—'}
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>FC PROM</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.title, fontSize: 24, color: '#587050' }}>
            {data?.sueno_horas ? `${data.sueno_horas.toFixed(1)}h` : '—'}
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>SUEÑO</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.title, fontSize: 24, color: COLORS.accent }}>
            {data?.calorias_activas ?? '—'}
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>CAL ACT</Text>
        </View>
      </View>
    </Card>
  );
}
