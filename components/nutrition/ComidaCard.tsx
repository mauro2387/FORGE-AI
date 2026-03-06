/**
 * ComidaCard.tsx — Card de una comida registrada
 * Dependencias: Card, nutrition.types
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { COLORS, FONTS } from '@/constants/theme';
import type { Comida } from '@/types/nutrition.types';

interface ComidaCardProps {
  comida: Comida;
  onPress?: () => void;
  onDelete?: () => void;
}

export function ComidaCard({ comida, onPress, onDelete }: ComidaCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textTransform: 'uppercase' }}>
                {comida.tipo_comida}
              </Text>
              {comida.del_plan && (
                <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: '#587050' }}>DEL PLAN</Text>
              )}
            </View>
            <Text style={{ fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.white, marginTop: 4 }}>
              {comida.nombre}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: FONTS.title, fontSize: 20, color: COLORS.accent }}>
              {Math.round(comida.calorias_total)}
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>KCAL</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: '#2a7a9a' }}>
            P: {Math.round(comida.proteina_total)}g
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.accent }}>
            C: {Math.round(comida.carbos_total)}g
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: '#587050' }}>
            G: {Math.round(comida.grasas_total)}g
          </Text>
        </View>

        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            style={{ position: 'absolute', top: 12, right: 12 }}
            accessibilityLabel="Eliminar comida"
          >
            <Text style={{ color: '#ef4444', fontSize: 14 }}>✕</Text>
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
  );
}
