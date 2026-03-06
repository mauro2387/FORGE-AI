/**
 * CaloriasSummary.tsx — Resumen de calorías del día
 * Dependencias: MacroRing, NativeWind
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { MacroRing } from './MacroRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { COLORS, FONTS } from '@/constants/theme';

interface CaloriasSummaryProps {
  consumido: {
    calorias: number;
    proteina_g: number;
    carbos_g: number;
    grasas_g: number;
  };
  objetivo: {
    calorias: number;
    proteina_g: number;
    carbos_g: number;
    grasas_g: number;
  };
}

export function CaloriasSummary({ consumido, objetivo }: CaloriasSummaryProps) {
  const restante = objetivo.calorias - consumido.calorias;

  return (
    <Card>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontFamily: FONTS.title, fontSize: 36, color: COLORS.accent }}>
          {Math.round(consumido.calorias)}
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>
          DE {objetivo.calorias} KCAL
        </Text>
        <ProgressBar
          progress={objetivo.calorias > 0 ? consumido.calorias / objetivo.calorias : 0}
          height={6}
        />
        <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: restante >= 0 ? '#587050' : '#ef4444', marginTop: 4 }}>
          {restante >= 0 ? `${Math.round(restante)} kcal restantes` : `${Math.abs(Math.round(restante))} kcal excedido`}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <MacroRing
          consumido={consumido.proteina_g}
          objetivo={objetivo.proteina_g}
          label="Proteína"
          color="#2a7a9a"
          size={70}
        />
        <MacroRing
          consumido={consumido.carbos_g}
          objetivo={objetivo.carbos_g}
          label="Carbos"
          color="#c4a040"
          size={70}
        />
        <MacroRing
          consumido={consumido.grasas_g}
          objetivo={objetivo.grasas_g}
          label="Grasas"
          color="#587050"
          size={70}
        />
      </View>
    </Card>
  );
}
