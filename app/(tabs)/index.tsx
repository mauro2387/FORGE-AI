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
  const { data: bandData, available: bandAvailable } = useBandData();

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
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 32 }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontFamily: FONTS.title, fontSize: 36, color: COLORS.accent }}>
            FORGE
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB }}>
            {profile?.nombre?.toUpperCase() || 'SOLDADO'} — SEMANA {profile?.semana_programa || 1}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
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
        mensaje={planActual ? `Semana ${planActual.semana_numero} en curso. ${progresoHabitos >= 0.8 ? 'Excelente disciplina.' : 'Mantené el ritmo.'}` : null}
        tareaMañana={null}
      />

      {/* Entrenamiento del día */}
      <DiaResumen
        diaPlan={diaHoy}
        workoutCompletado={false}
        caloriasConsumidas={consumido.calorias}
        caloriasObjetivo={objetivos.calorias}
        habitosCompletados={Math.round(progresoHabitos * 8)}
        habitosTotal={8}
        onEntrenar={() => router.push('/(tabs)/entrenamiento')}
      />

      {/* Quick stats row */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        {/* Hábitos */}
        <View style={{ flex: 1 }}>
          <Card>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent }}>
              DISCIPLINA
            </Text>
            <Text style={{ fontFamily: FONTS.title, fontSize: 28, color: COLORS.text, marginTop: 4 }}>
              {Math.round(progresoHabitos * 100)}%
            </Text>
            <View style={{ marginTop: 8 }}>
              <ProgressBar progress={progresoHabitos} />
            </View>
          </Card>
        </View>

        {/* Nutrición */}
        <View style={{ flex: 1 }}>
          <Card>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent }}>
              RACIÓN
            </Text>
            <Text style={{ fontFamily: FONTS.title, fontSize: 28, color: COLORS.text, marginTop: 4 }}>
              {consumido.calorias}
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textB }}>
              /{objetivos.calorias} kcal
            </Text>
            <View style={{ marginTop: 8 }}>
              <ProgressBar progress={progresoCalorias} />
            </View>
          </Card>
        </View>
      </View>

      {/* Rachas */}
      {rachasActivas.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Card>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent, marginBottom: 8 }}>
              RACHAS ACTIVAS
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {rachasActivas.map((racha) => (
                <View key={racha.id} style={{ alignItems: 'center' }}>
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
        </View>
      )}

      {/* Band data */}
      {bandData && <BandStats data={bandData} available={bandAvailable} />}

      {/* Quick actions */}
      <View style={{ gap: 12, marginTop: 24 }}>
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
