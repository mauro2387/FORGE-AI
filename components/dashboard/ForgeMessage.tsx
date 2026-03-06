/**
 * ForgeMessage.tsx — Mensaje diario de FORGE IA
 * Dependencias: Card
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { COLORS, FONTS } from '@/constants/theme';

interface ForgeMessageProps {
  mensaje: string | null;
  tareaMañana: string | null;
}

export function ForgeMessage({ mensaje, tareaMañana }: ForgeMessageProps) {
  if (!mensaje && !tareaMañana) return null;

  return (
    <Card style={{ borderColor: 'rgba(196, 160, 64, 0.3)' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Text style={{ fontFamily: FONTS.title, fontSize: 18, color: COLORS.accent }}>FORGE</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(196, 160, 64, 0.2)' }} />
      </View>

      {mensaje && (
        <Text style={{ fontFamily: FONTS.body, fontSize: 16, color: COLORS.textB, lineHeight: 20, marginBottom: 8 }}>
          {mensaje}
        </Text>
      )}

      {tareaMañana && (
        <View style={{ backgroundColor: 'rgba(196, 160, 64, 0.1)', borderWidth: 1, borderColor: 'rgba(196, 160, 64, 0.2)', borderRadius: 10, padding: 12, marginTop: 4 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase', marginBottom: 4 }}>
            Tarea de hoy
          </Text>
          <Text style={{ fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.white }}>
            {tareaMañana}
          </Text>
        </View>
      )}
    </Card>
  );
}
