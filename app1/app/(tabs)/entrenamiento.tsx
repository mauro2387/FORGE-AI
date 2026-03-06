import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useWorkout } from '@/hooks/useWorkout';
import { usePlanStore } from '@/stores/planStore';
import { useUserStore } from '@/stores/userStore';
import { EjercicioCard } from '@/components/workout/EjercicioCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS, COLORS } from '@/constants/theme';

export default function EntrenamientoScreen() {
  const profile = useUserStore((s) => s.profile);
  const planActual = usePlanStore((s) => s.planActual);
  const getDiaHoy = usePlanStore((s) => s.getDiaHoy);
  const getDiaSemana = usePlanStore((s) => s.getDiaSemana);
  const fetchPlanActual = usePlanStore((s) => s.fetchPlanActual);

  const {
    ejercicioActual,
    workoutActivo,
    progresoTotal,
    workoutCompletado,
    totalEjercicios,
    ejercicioIndex,
    iniciarWorkout,
    loading,
  } = useWorkout();

  useEffect(() => {
    if (profile?.id && !planActual) {
      fetchPlanActual(profile.id);
    }
  }, [profile?.id, planActual, fetchPlanActual]);

  const diaHoy = getDiaHoy();
  const diaSemana = getDiaSemana();

  if (!diaHoy) {
    return (
      <View className="flex-1 bg-bg items-center justify-center p-8">
        <Text style={{ fontSize: 48 }}>🏖️</Text>
        <Text
          style={{
            fontFamily: FONTS.title,
            fontSize: 28,
            color: COLORS.accent,
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          DÍA DE DESCANSO
        </Text>
        <Text
          style={{
            fontFamily: FONTS.body,
            fontSize: 14,
            color: COLORS.textB,
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Hoy es {diaSemana}. Tu cuerpo necesita recuperarse para volver más fuerte.
        </Text>
      </View>
    );
  }

  if (workoutActivo) {
    return (
      <View className="flex-1 bg-bg pt-14 px-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text style={{ fontFamily: FONTS.title, fontSize: 24, color: COLORS.accent }}>
              EN COMBATE
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB }}>
              {ejercicioIndex + 1}/{totalEjercicios} EJERCICIOS
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Alert.alert(
                'Cancelar entrenamiento',
                '¿Seguro? Se perderá el progreso de esta sesión.',
                [
                  { text: 'Seguir', style: 'cancel' },
                  {
                    text: 'Cancelar',
                    style: 'destructive',
                    onPress: () => {
                      // cancelarWorkout will reset the store
                    },
                  },
                ],
              );
            }}
          >
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: '#ef4444' }}>
              ABORTAR
            </Text>
          </Pressable>
        </View>

        <ProgressBar progress={progresoTotal} />

        {ejercicioActual && (
          <Pressable
            className="mt-4"
            onPress={() => router.push('/modals/ejercicio-activo')}
          >
            <EjercicioCard
              ejercicio={ejercicioActual}
              index={ejercicioIndex}
              activo
            />
          </Pressable>
        )}

        {workoutCompletado && (
          <Button
            title="FINALIZAR SESIÓN"
            variant="primary"
            className="mt-6"
            onPress={() => router.push('/modals/ejercicio-activo')}
          />
        )}
      </View>
    );
  }

  // Preview del workout del día
  const ejercicios = diaHoy.ejercicios || [];

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, paddingTop: 60 }}
    >
      <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent }}>
        {diaHoy.tipo?.toUpperCase() || 'ENTRENAMIENTO'}
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 2 }}>
        {diaSemana?.toUpperCase()} — {diaHoy.ubicacion?.toUpperCase() || 'CASA'}
      </Text>

      {diaHoy.calentamiento && (
        <Card className="mt-4">
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
            CALENTAMIENTO
          </Text>
          <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.text, marginTop: 4 }}>
            {diaHoy.calentamiento}
          </Text>
        </Card>
      )}

      <View className="mt-4 gap-3">
        {ejercicios.map((ej, idx) => (
          <EjercicioCard
            key={`${ej.nombre}-${idx}`}
            ejercicio={ej}
            index={idx}
          />
        ))}
      </View>

      {diaHoy.enfriamiento && (
        <Card className="mt-4">
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
            ENFRIAMIENTO
          </Text>
          <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.text, marginTop: 4 }}>
            {diaHoy.enfriamiento}
          </Text>
        </Card>
      )}

      <View className="mt-4 mb-4">
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textB, textAlign: 'center' }}>
          DURACIÓN ESTIMADA: {diaHoy.duracion_estimada_min || '?'} MIN
        </Text>
      </View>

      <Button
        title="⚔️ INICIAR ENTRENAMIENTO"
        variant="primary"
        loading={loading}
        onPress={() => {
          iniciarWorkout(
            diaHoy.tipo || 'ENTRENAMIENTO',
            diaHoy.ubicacion || 'CASA',
            ejercicios,
          );
          router.push('/modals/ejercicio-activo');
        }}
        className="mb-8"
      />
    </ScrollView>
  );
}
