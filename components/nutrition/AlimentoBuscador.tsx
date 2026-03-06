/**
 * AlimentoBuscador.tsx — Buscador de alimentos con Open Food Facts
 * Dependencias: openFoodFacts, NativeWind
 */

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from '@/components/ui/Input';
import { buscarAlimento } from '@/lib/openFoodFacts';
import type { OpenFoodFactsProduct } from '@/types/nutrition.types';

interface AlimentoBuscadorProps {
  onSelect: (producto: OpenFoodFactsProduct, cantidadG: number) => void;
}

export function AlimentoBuscador({ onSelect }: AlimentoBuscadorProps) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<OpenFoodFactsProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [cantidadG, setCantidadG] = useState('100');

  const buscar = useCallback(async () => {
    if (query.trim().length < 2) return;
    setLoading(true);
    try {
      const results = await buscarAlimento(query.trim());
      setResultados(results);
    } catch {
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const renderItem = useCallback(
    ({ item }: { item: OpenFoodFactsProduct }) => {
      const cantidad = parseInt(cantidadG, 10) || 100;
      const factor = cantidad / 100;
      const kcal = Math.round(item.nutriments['energy-kcal_100g'] * factor);
      const prot = Math.round(item.nutriments.proteins_100g * factor);

      return (
        <TouchableOpacity
          onPress={() => onSelect(item, cantidad)}
          className="bg-bg border border-border rounded-lg p-3 mb-2"
          activeOpacity={0.7}
        >
          <Text className="text-white font-barlow-medium text-base" numberOfLines={1}>
            {item.product_name}
          </Text>
          <View className="flex-row gap-3 mt-1">
            <Text className="text-accent font-mono text-xs">{kcal} kcal</Text>
            <Text className="text-blue font-mono text-xs">P: {prot}g</Text>
            <Text className="text-text font-mono text-xs">
              C: {Math.round(item.nutriments.carbohydrates_100g * factor)}g
            </Text>
            <Text className="text-text font-mono text-xs">
              G: {Math.round(item.nutriments.fat_100g * factor)}g
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [cantidadG, onSelect],
  );

  return (
    <View className="gap-3">
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input
            placeholder="Buscar alimento..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={buscar}
            returnKeyType="search"
          />
        </View>
        <View className="w-20">
          <Input
            placeholder="100"
            value={cantidadG}
            onChangeText={setCantidadG}
            keyboardType="numeric"
            suffix="g"
          />
        </View>
      </View>

      {loading && (
        <ActivityIndicator size="small" color="#c4a040" className="my-4" />
      )}

      <FlatList
        data={resultados}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <Text className="text-text font-barlow text-center py-4">
              Sin resultados
            </Text>
          ) : null
        }
      />
    </View>
  );
}
