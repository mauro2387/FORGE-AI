/**
 * ComidaCard.tsx — Card de una comida registrada
 * Dependencias: Card, nutrition.types
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
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
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-text font-mono text-xs uppercase">
                {comida.tipo_comida}
              </Text>
              {comida.del_plan && (
                <Text className="text-olive-l font-mono text-xs">DEL PLAN</Text>
              )}
            </View>
            <Text className="text-white font-barlow-medium text-base mt-1">
              {comida.nombre}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-accent font-bebas text-xl">
              {Math.round(comida.calorias_total)}
            </Text>
            <Text className="text-text font-mono text-xs">KCAL</Text>
          </View>
        </View>

        <View className="flex-row gap-4 mt-2">
          <Text className="text-blue font-mono text-xs">
            P: {Math.round(comida.proteina_total)}g
          </Text>
          <Text className="text-accent font-mono text-xs">
            C: {Math.round(comida.carbos_total)}g
          </Text>
          <Text className="text-olive-l font-mono text-xs">
            G: {Math.round(comida.grasas_total)}g
          </Text>
        </View>

        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            className="absolute top-3 right-3"
            accessibilityLabel="Eliminar comida"
          >
            <Text className="text-danger text-sm">✕</Text>
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
  );
}
