import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Vibration } from 'react-native';
import { router } from 'expo-router';
import { useWorkout } from '@/hooks/useWorkout';
import { useWorkoutStore } from '@/stores/workoutStore';
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

  const timer = useTimer({ duracionSeg: 0, autoStart: false });

  const [repsInput, setRepsInput] = useState('');
  const [pesoInput, setPesoInput] = useState('');

  if (workoutCompletado) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <WorkoutSummary
          ejercicios={seriesCompletadasDelEjercicio.length > 0 ? useWorkoutStore.getState().ejerciciosCompletados : []}
          duracionMin={0}
          onClose={async () => {
            await finalizarWorkout();
            router.back();
          }}
        />
      </View>
    );
  }

  if (!ejercicioActual) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: FONTS.body, fontSize: 16, color: COLORS.textB }}>
          Sin ejercicio cargado
        </Text>
        <View style={{ marginTop: 16 }}>
          <Button title="VOLVER" onPress={() => router.back()} variant="outline" />
        </View>
      </View>
    );
  }

  if (enDescanso) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <RestTimer
          duracionSeg={ejercicioActual.descanso_seg}
          onComplete={finalizarDescanso}
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
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 16 }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
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
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontFamily: FONTS.title, fontSize: 28, color: COLORS.accent }}>
          {ejercicioActual.nombre}
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 2 }}>
          {ejercicioActual.series} SERIES × {ejercicioActual.reps} REPS
          {ejercicioActual.peso_kg ? ` — ${ejercicioActual.peso_kg}kg` : ''}
        </Text>

        {ejercicioActual.notas && (
          <Text style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.olive, marginTop: 4 }}>
            💡 {ejercicioActual.notas}
          </Text>
        )}
      </View>

      {/* GIF */}
      <View style={{ marginTop: 16, borderRadius: 14, overflow: 'hidden' }}>
        <ExerciseGif exerciseDbId={ejercicioActual.exercise_db_id} nombre={ejercicioActual.nombre} />
      </View>

      {/* Series completadas */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textB, marginBottom: 8 }}>
          SERIES COMPLETADAS
        </Text>
        {seriesCompletadasDelEjercicio.map((serie, idx) => (
          <SerieRow
            key={idx}
            serieNumero={idx + 1}
            serie={serie}
            repsObjetivo={ejercicioActual!.reps}
            pesoObjetivo={ejercicioActual!.peso_kg}
            esActual={false}
          />
        ))}
      </View>

      {/* Serie actual */}
      {!ejercicioCompletado && (
        <View style={{ marginTop: 16, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: COLORS.accent, backgroundColor: '#0c0e12' }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, marginBottom: 8 }}>
            SERIE {serieActual} DE {ejercicioActual.series}
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Input
                label="REPS"
                value={repsInput}
                onChangeText={setRepsInput}
                placeholder={ejercicioActual.reps}
                keyboardType="number-pad"
              />
            </View>
            {ejercicioActual.peso_kg != null && (
              <View style={{ flex: 1 }}>
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

          <View style={{ marginTop: 16 }}>
            <Button
              title="✓ COMPLETAR SERIE"
              variant="primary"
              onPress={handleCompletarSerie}
            />
          </View>
        </View>
      )}

      {/* Siguiente ejercicio */}
      {ejercicioCompletado && !workoutCompletado && (
        <View style={{ marginTop: 24 }}>
          <Button
            title="SIGUIENTE EJERCICIO →"
            variant="primary"
            onPress={handleSiguienteEjercicio}
          />
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
