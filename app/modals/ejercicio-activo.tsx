import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Vibration } from 'react-native';
import { router } from 'expo-router';
import { useWorkout } from '@/hooks/useWorkout';
import { useTimer } from '@/hooks/useTimer';
import { ExerciseGif } from '@/components/workout/ExerciseGif';
import { SerieRow } from '@/components/workout/SerieRow';
import { RestTimer } from '@/components/workout/RestTimer';
import { WorkoutSummary } from '@/components/workout/WorkoutSummary';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS, COLORS } from '@/constants/theme';

export default function EjercicioActivoModal() {
  const {
    ejercicioActual,
    ejercicioIndex,
    totalEjercicios,
    serieActual,
    seriesCompletadasDelEjercicio,
    ejercicioCompletado,
    workoutCompletado,
    progresoTotal,
    enDescanso,
    tiempoDescanso,
    registrarSerie,
    iniciarDescansoPostSerie,
    siguienteEjercicio,
    finalizarDescanso,
    finalizarWorkout,
    cancelarWorkout,
    loading,
  } = useWorkout();

  const timer = useTimer();

  const [repsInput, setRepsInput] = useState('');
  const [pesoInput, setPesoInput] = useState('');

  if (workoutCompletado) {
    return (
      <View className="flex-1 bg-bg">
        <WorkoutSummary
          onFinish={async () => {
            await finalizarWorkout();
            router.back();
          }}
        />
      </View>
    );
  }

  if (!ejercicioActual) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <Text style={{ fontFamily: FONTS.body, fontSize: 16, color: COLORS.textB }}>
          Sin ejercicio cargado
        </Text>
        <Button title="VOLVER" onPress={() => router.back()} variant="outline" className="mt-4" />
      </View>
    );
  }

  if (enDescanso) {
    return (
      <View className="flex-1 bg-bg items-center justify-center p-6">
        <RestTimer
          segundosRestantes={tiempoDescanso}
          segundosTotal={ejercicioActual.descanso_seg}
          onSkip={finalizarDescanso}
        />
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: COLORS.textB,
            marginTop: 16,
          }}
        >
          PRÓXIMA: SERIE {serieActual} DE {ejercicioActual.series}
        </Text>
      </View>
    );
  }

  function handleCompletarSerie() {
    const reps = parseInt(repsInput) || parseInt(ejercicioActual!.reps) || 0;
    const peso = pesoInput ? parseFloat(pesoInput) : ejercicioActual!.peso_kg;

    registrarSerie(reps, peso, null, null);
    setRepsInput('');
    setPesoInput('');

    Vibration.vibrate(100);

    if (serieActual < ejercicioActual!.series) {
      iniciarDescansoPostSerie();
    }
  }

  function handleSiguienteEjercicio() {
    siguienteEjercicio();
    setRepsInput('');
    setPesoInput('');
  }

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, paddingTop: 16 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.textB }}>
            ← ATRÁS
          </Text>
        </Pressable>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB }}>
          {ejercicioIndex + 1}/{totalEjercicios}
        </Text>
        <Pressable
          onPress={() => {
            Alert.alert('Cancelar', '¿Abandonar entrenamiento?', [
              { text: 'No', style: 'cancel' },
              {
                text: 'Sí, cancelar',
                style: 'destructive',
                onPress: () => {
                  cancelarWorkout();
                  router.back();
                },
              },
            ]);
          }}
        >
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: '#ef4444' }}>
            CANCELAR
          </Text>
        </Pressable>
      </View>

      <ProgressBar progress={progresoTotal} />

      {/* Exercise Info */}
      <View className="mt-4">
        <Text style={{ fontFamily: FONTS.title, fontSize: 28, color: COLORS.accent }}>
          {ejercicioActual.nombre}
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 2 }}>
          {ejercicioActual.series} SERIES × {ejercicioActual.reps} REPS
          {ejercicioActual.peso_kg ? ` — ${ejercicioActual.peso_kg}kg` : ''}
        </Text>

        {ejercicioActual.nota && (
          <Text style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.olive, marginTop: 4 }}>
            💡 {ejercicioActual.nota}
          </Text>
        )}
      </View>

      {/* GIF */}
      <View className="mt-4 rounded-xl overflow-hidden">
        <ExerciseGif exerciseId={ejercicioActual.ejercicio_id} />
      </View>

      {/* Series completadas */}
      <View className="mt-6">
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textB, marginBottom: 8 }}>
          SERIES COMPLETADAS
        </Text>
        {seriesCompletadasDelEjercicio.map((serie, idx) => (
          <SerieRow key={idx} serie={serie} index={idx} />
        ))}
      </View>

      {/* Serie actual */}
      {!ejercicioCompletado && (
        <View className="mt-4 p-4 rounded-xl border border-accent bg-bg2">
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, marginBottom: 8 }}>
            SERIE {serieActual} DE {ejercicioActual.series}
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="REPS"
                value={repsInput}
                onChangeText={setRepsInput}
                placeholder={ejercicioActual.reps}
                keyboardType="number-pad"
              />
            </View>
            {ejercicioActual.peso_kg != null && (
              <View className="flex-1">
                <Input
                  label="PESO (kg)"
                  value={pesoInput}
                  onChangeText={setPesoInput}
                  placeholder={String(ejercicioActual.peso_kg || '')}
                  keyboardType="decimal-pad"
                />
              </View>
            )}
          </View>

          <Button
            title="✓ COMPLETAR SERIE"
            variant="primary"
            onPress={handleCompletarSerie}
            className="mt-4"
          />
        </View>
      )}

      {/* Siguiente ejercicio */}
      {ejercicioCompletado && !workoutCompletado && (
        <Button
          title="SIGUIENTE EJERCICIO →"
          variant="primary"
          onPress={handleSiguienteEjercicio}
          className="mt-6"
        />
      )}

      <View className="h-8" />
    </ScrollView>
  );
}
