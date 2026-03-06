/**
 * AlimentoBuscador.tsx — Buscador de alimentos con Open Food Facts
 * Dependencias: openFoodFacts, NativeWind
 */

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from '@/components/ui/Input';
import { buscarAlimento } from '@/lib/openFoodFacts';
import { COLORS, FONTS } from '@/constants/theme';
import type { OpenFoodFactsProduct } from '@/types/nutrition.types';

interface AlimentoBuscadorProps {
  onSelect: (producto: OpenFoodFactsProduct, cantidadG: number) => void;
  onClose?: () => void;
}

export function AlimentoBuscador({ onSelect, onClose }: AlimentoBuscadorProps) {
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
          style={{ backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, marginBottom: 8 }}
          activeOpacity={0.7}
        >
          <Text style={{ fontFamily: FONTS.bodyBold, fontSize: 16, color: COLORS.white }} numberOfLines={1}>
            {item.product_name}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.accent }}>{kcal} kcal</Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: '#2a7a9a' }}>P: {prot}g</Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>
              C: {Math.round(item.nutriments.carbohydrates_100g * factor)}g
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text }}>
              G: {Math.round(item.nutriments.fat_100g * factor)}g
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [cantidadG, onSelect],
  );

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Buscar alimento..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={buscar}
            returnKeyType="search"
          />
        </View>
        <View style={{ width: 80 }}>
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
        <ActivityIndicator size="small" color="#c4a040" style={{ marginVertical: 16 }} />
      )}

      <FlatList
        data={resultados}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.text, textAlign: 'center', paddingVertical: 16 }}>
              Sin resultados
            </Text>
          ) : null
        }
      />
    </View>
  );
}
