/**
 * CaloriasSummary.tsx — Resumen de calorías del día
 * Dependencias: MacroRing, NativeWind
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { MacroRing } from './MacroRing';
import { ProgressBar } from '@/components/ui/ProgressBar';

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
      <View className="items-center mb-4">
        <Text className="text-accent font-bebas text-4xl">
          {Math.round(consumido.calorias)}
        </Text>
        <Text className="text-text font-mono text-xs">
          DE {objetivo.calorias} KCAL
        </Text>
        <ProgressBar
          progress={objetivo.calorias > 0 ? consumido.calorias / objetivo.calorias : 0}
          height={6}
        />
        <Text className={`font-mono text-sm mt-1 ${restante >= 0 ? 'text-olive-l' : 'text-danger'}`}>
          {restante >= 0 ? `${Math.round(restante)} kcal restantes` : `${Math.abs(Math.round(restante))} kcal excedido`}
        </Text>
      </View>

      <View className="flex-row justify-around">
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
