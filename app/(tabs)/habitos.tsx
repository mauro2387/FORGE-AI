import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useHabits } from '@/hooks/useHabits';
import { useUserStore } from '@/stores/userStore';
import { HabitRow } from '@/components/habits/HabitRow';
import { RachaCard } from '@/components/habits/RachaCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { FONTS, COLORS } from '@/constants/theme';

export default function HabitosScreen() {
  const profile = useUserStore((s) => s.profile);
  const {
    habitosConEstado,
    progresoHabitos,
    rachasActivas,
    toggleHabito,
    resetRacha,
    loading,
  } = useHabits();

  const completados = habitosConEstado.filter((h) => h.completado).length;
  const total = habitosConEstado.length;

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, paddingTop: 60 }}
    >
      {/* Header */}
      <View className="flex-row items-end justify-between">
        <View>
          <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent }}>
            DISCIPLINA
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 2 }}>
            HÁBITOS DIARIOS — {completados}/{total}
          </Text>
        </View>
        <Text style={{ fontFamily: FONTS.title, fontSize: 36, color: COLORS.accent }}>
          {Math.round(progresoHabitos * 100)}%
        </Text>
      </View>

      <ProgressBar progress={progresoHabitos} className="mt-3" />

      {/* Hábitos */}
      <View className="mt-6 gap-2">
        {habitosConEstado.map((habito) => (
          <HabitRow
            key={habito.id}
            habito={habito}
            onToggle={() => toggleHabito(habito.id)}
          />
        ))}
      </View>

      {/* Rachas de adicciones */}
      {rachasActivas.length > 0 && (
        <View className="mt-8">
          <Text style={{ fontFamily: FONTS.title, fontSize: 24, color: COLORS.accent }}>
            RACHAS
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 2 }}>
            ABSTINENCIA ACTIVA — MANTENÉ LA LÍNEA
          </Text>

          <View className="gap-3 mt-4">
            {rachasActivas.map((racha) => (
              <RachaCard
                key={racha.id}
                racha={racha}
                onReset={() => resetRacha(racha.id)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Mensaje motivacional */}
      <Card className="mt-8 mb-8">
        <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.olive, textAlign: 'center' }}>
          {progresoHabitos >= 1
            ? '🏆 MISIÓN CUMPLIDA. Todos los hábitos completados. Sos disciplina pura.'
            : progresoHabitos >= 0.7
            ? '⚡ Buen progreso. No aflojes ahora — la disciplina se forja en los últimos hábitos.'
            : progresoHabitos >= 0.3
            ? '🔥 Vas en camino. Cada hábito que completás te acerca a la versión que querés ser.'
            : '💀 Recién arrancás. La diferencia entre vos y tu objetivo son estos hábitos.'}
        </Text>
      </Card>
    </ScrollView>
  );
}
