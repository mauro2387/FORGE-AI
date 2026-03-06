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
import type { Comida, Alimento } from '@/types/nutrition.types';

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

  function handleAgregarAlimento(alimento: Alimento) {
    if (!activeSlot) return;

    const comida: Comida = {
      nombre: alimento.nombre,
      cantidad_g: alimento.porcion_g,
      calorias: alimento.calorias,
      proteina_g: alimento.proteina_g,
      carbos_g: alimento.carbos_g,
      grasas_g: alimento.grasas_g,
    };

    agregarComida(activeSlot, comida);
    setBuscadorVisible(false);
  }

  function getComidasDelSlot(slot: MealSlot): Comida[] {
    if (!logHoy) return [];
    return (logHoy as Record<string, Comida[]>)[slot] || [];
  }

  return (
    <ScrollView
      className="flex-1 bg-bg"
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
        consumido={consumido.calorias}
        objetivo={objetivos.calorias}
        restante={restante.calorias}
        progreso={progresoCalorias}
      />

      {/* Macros */}
      <View className="flex-row justify-around mt-4">
        <MacroRing
          label="PROT"
          actual={consumido.proteina}
          objetivo={objetivos.proteina}
          color="#c4a040"
        />
        <MacroRing
          label="CARBS"
          actual={consumido.carbos}
          objetivo={objetivos.carbos}
          color="#3d4f3a"
        />
        <MacroRing
          label="GRASAS"
          actual={consumido.grasas}
          objetivo={objetivos.grasas}
          color="#6b7b6e"
        />
      </View>

      {/* Meal slots */}
      <View className="mt-6 gap-4">
        {MEAL_SLOTS.map(({ key, label, emoji }) => {
          const comidas = getComidasDelSlot(key);
          const calSlot = comidas.reduce((s, c) => s + c.calorias, 0);

          return (
            <Card key={key}>
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
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
                  onDelete={() => eliminarComida(key, idx)}
                />
              ))}

              <Pressable
                onPress={() => {
                  setActiveSlot(key);
                  setBuscadorVisible(true);
                }}
                className="mt-2 p-2 rounded border border-border items-center"
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
        <View className="mt-4">
          <AlimentoBuscador
            onSelect={handleAgregarAlimento}
            onClose={() => setBuscadorVisible(false)}
          />
        </View>
      )}

      <View className="h-8" />
    </ScrollView>
  );
}
