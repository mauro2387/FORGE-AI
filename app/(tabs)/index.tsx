import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from '@/stores/userStore';
import { usePlanStore } from '@/stores/planStore';
import { useHabits } from '@/hooks/useHabits';
import { useNutrition } from '@/hooks/useNutrition';
import { useBandData } from '@/hooks/useBandData';
import { DiaResumen } from '@/components/dashboard/DiaResumen';
import { BandStats } from '@/components/dashboard/BandStats';
import { ForgeMessage } from '@/components/dashboard/ForgeMessage';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { FONTS, COLORS } from '@/constants/theme';

export default function DashboardScreen() {
  const profile = useUserStore((s) => s.profile);
  const planActual = usePlanStore((s) => s.planActual);
  const getDiaHoy = usePlanStore((s) => s.getDiaHoy);
  const getDiaSemana = usePlanStore((s) => s.getDiaSemana);
  const fetchPlanActual = usePlanStore((s) => s.fetchPlanActual);

  const { progresoHabitos, rachasActivas } = useHabits();
  const { progresoCalorias, consumido, objetivos } = useNutrition();
  const { bandData } = useBandData();

  useEffect(() => {
    if (profile?.id && !planActual) {
      fetchPlanActual(profile.id);
    }
  }, [profile?.id, planActual, fetchPlanActual]);

  const diaHoy = getDiaHoy();
  const diaSemana = getDiaSemana();

  const faseLabel: Record<string, string> = {
    FASE_1: 'REACTIVACIÓN',
    FASE_2: 'CONSTRUCCIÓN',
    FASE_3: 'COMBATE',
    FASE_4: 'ÉLITE',
  };

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 32 }}
    >
      {/* Header */}
      <View className="flex-row items-end justify-between">
        <View>
          <Text style={{ fontFamily: FONTS.title, fontSize: 36, color: COLORS.accent }}>
            FORGE
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB }}>
            {profile?.nombre?.toUpperCase() || 'SOLDADO'} — SEMANA {profile?.semana_programa || 1}
          </Text>
        </View>
        <View className="items-end">
          <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.olive }}>
            {faseLabel[profile?.fase_actual || 'FASE_1'] || 'FASE 1'}
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textB }}>
            {diaSemana?.toUpperCase() || ''}
          </Text>
        </View>
      </View>

      {/* FORGE Message */}
      <ForgeMessage
        planActual={planActual}
        diaHoy={diaHoy}
        progresoHabitos={progresoHabitos}
      />

      {/* Entrenamiento del día */}
      <DiaResumen diaHoy={diaHoy} diaSemana={diaSemana} />

      {/* Quick stats row */}
      <View className="flex-row gap-3 mt-4">
        {/* Hábitos */}
        <Card className="flex-1">
          <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent }}>
            DISCIPLINA
          </Text>
          <Text style={{ fontFamily: FONTS.title, fontSize: 28, color: COLORS.text, marginTop: 4 }}>
            {Math.round(progresoHabitos * 100)}%
          </Text>
          <ProgressBar progress={progresoHabitos} className="mt-2" />
        </Card>

        {/* Nutrición */}
        <Card className="flex-1">
          <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent }}>
            RACIÓN
          </Text>
          <Text style={{ fontFamily: FONTS.title, fontSize: 28, color: COLORS.text, marginTop: 4 }}>
            {consumido.calorias}
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textB }}>
            /{objetivos.calorias} kcal
          </Text>
          <ProgressBar progress={progresoCalorias} className="mt-2" />
        </Card>
      </View>

      {/* Rachas */}
      {rachasActivas.length > 0 && (
        <Card className="mt-4">
          <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent, marginBottom: 8 }}>
            RACHAS ACTIVAS
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {rachasActivas.map((racha) => (
              <View key={racha.id} className="items-center">
                <Text style={{ fontFamily: FONTS.title, fontSize: 24, color: COLORS.accent }}>
                  {racha.racha_actual_dias}
                </Text>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.textB }}>
                  {String(racha.tipo).toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Band data */}
      {bandData && <BandStats bandData={bandData} />}

      {/* Quick actions */}
      <View className="gap-3 mt-6">
        <Button
          title="📝 CHECK-IN NOCTURNO"
          variant="outline"
          onPress={() => router.push('/modals/checkin')}
        />
        <Button
          title="📸 FOTO SEMANAL"
          variant="outline"
          onPress={() => router.push('/modals/foto-semanal')}
        />
        <Button
          title="🤖 CONSULTAR A FORGE"
          variant="outline"
          onPress={() => router.push('/modals/consulta-ia')}
        />
      </View>
    </ScrollView>
  );
}
