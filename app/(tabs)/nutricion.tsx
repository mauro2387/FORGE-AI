import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useNutrition } from '@/hooks/useNutrition';
import { useUserStore } from '@/stores/userStore';
import { CaloriasSummary } from '@/components/nutrition/CaloriasSummary';
import { MacroRing } from '@/components/nutrition/MacroRing';
import { ComidaCard } from '@/components/nutrition/ComidaCard';
import { AlimentoBuscador } from '@/components/nutrition/AlimentoBuscador';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, COLORS } from '@/constants/theme';
import type { Comida } from '@/types/nutrition.types';

type MealSlot = 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack';

const MEAL_SLOTS: { key: MealSlot; label: string; emoji: string }[] = [
  { key: 'desayuno', label: 'DESAYUNO', emoji: '🌅' },
  { key: 'almuerzo', label: 'ALMUERZO', emoji: '☀️' },
  { key: 'merienda', label: 'MERIENDA', emoji: '🕐' },
  { key: 'cena', label: 'CENA', emoji: '🌙' },
  { key: 'snack', label: 'SNACKS', emoji: '🥜' },
];

export default function NutricionScreen() {
  const profile = useUserStore((s) => s.profile);
  const {
    logHoy,
    objetivos,
    consumido,
    restante,
    progresoCalorias,
    agregarComida,
    eliminarComida,
    loading,
  } = useNutrition();

  const [activeSlot, setActiveSlot] = useState<MealSlot | null>(null);
  const [buscadorVisible, setBuscadorVisible] = useState(false);

  function handleAgregarAlimento(producto: import('@/types/nutrition.types').OpenFoodFactsProduct, cantidadG: number) {
    if (!activeSlot) return;
    const factor = cantidadG / 100;
    const comida: Omit<import('@/types/nutrition.types').Comida, 'id'> = {
      nombre: producto.product_name,
      tipo_comida: activeSlot.toUpperCase() as import('@/types/nutrition.types').TipoComida,
      alimentos: [],
      calorias_total: Math.round(producto.nutriments['energy-kcal_100g'] * factor),
      proteina_total: Math.round(producto.nutriments.proteins_100g * factor),
      carbos_total: Math.round(producto.nutriments.carbohydrates_100g * factor),
      grasas_total: Math.round(producto.nutriments.fat_100g * factor),
      hora: new Date().toISOString(),
      del_plan: false,
    };
    agregarComida(comida);
    setBuscadorVisible(false);
  }

  function getComidasDelSlot(slot: MealSlot): Comida[] {
    if (!logHoy) return [];
    return logHoy.comidas.filter((c) => c.tipo_comida === slot.toUpperCase()) || [];
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 60 }}
    >
      {/* Header */}
      <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent }}>
        RACIÓN
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 2 }}>
        CONTROL NUTRICIONAL — {new Date().toLocaleDateString('es-AR')}
      </Text>

      {/* Resumen calorías */}
      <CaloriasSummary
        consumido={consumido}
        objetivo={objetivos}
      />

      {/* Macros */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
        <MacroRing
          label="PROT"
          consumido={consumido.proteina_g}
          objetivo={objetivos.proteina_g}
          color="#c4a040"
        />
        <MacroRing
          label="CARBS"
          consumido={consumido.carbos_g}
          objetivo={objetivos.carbos_g}
          color="#3d4f3a"
        />
        <MacroRing
          label="GRASAS"
          consumido={consumido.grasas_g}
          objetivo={objetivos.grasas_g}
          color="#6b7b6e"
        />
      </View>

      {/* Meal slots */}
      <View style={{ marginTop: 24, gap: 16 }}>
        {MEAL_SLOTS.map(({ key, label, emoji }) => {
          const comidas = getComidasDelSlot(key);
          const calSlot = comidas.reduce((s, c) => s + c.calorias_total, 0);

          return (
            <Card key={key}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 18 }}>{emoji}</Text>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.accent }}>
                    {label}
                  </Text>
                </View>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB }}>
                  {calSlot} kcal
                </Text>
              </View>

              {comidas.map((comida, idx) => (
                <ComidaCard
                  key={idx}
                  comida={comida}
                  onDelete={() => eliminarComida(comida.id)}
                />
              ))}

              <Pressable
                onPress={() => {
                  setActiveSlot(key);
                  setBuscadorVisible(true);
                }}
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB }}>
                  + AGREGAR ALIMENTO
                </Text>
              </Pressable>
            </Card>
          );
        })}
      </View>

      {/* Buscador modal inline */}
      {buscadorVisible && (
        <View style={{ marginTop: 16 }}>
          <AlimentoBuscador
            onSelect={handleAgregarAlimento}
            onClose={() => setBuscadorVisible(false)}
          />
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
