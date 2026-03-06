import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS, COLORS } from '@/constants/theme';

const OPCIONES_HISTORIAL = [
  { id: 'ninguno', label: 'Sin experiencia', desc: 'Nunca entrené seriamente' },
  { id: 'principiante', label: 'Principiante', desc: 'Menos de 6 meses' },
  { id: 'intermedio', label: 'Intermedio', desc: '6 meses a 2 años' },
  { id: 'avanzado', label: 'Avanzado', desc: 'Más de 2 años' },
];

export default function StepHistorial() {
  const { data, setField } = useOnboardingStore();

  const canContinue = data.historial_entrenamiento.length > 0;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressBar progress={2 / 7} />

        <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent, marginTop: 24 }}>
          HISTORIAL
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 4 }}>
          PASO 2/7 — EXPERIENCIA PREVIA
        </Text>

        <View className="gap-3 mt-8">
          {OPCIONES_HISTORIAL.map((op) => (
            <Pressable
              key={op.id}
              onPress={() => setField('historial_entrenamiento', op.id)}
              className={`p-4 rounded-lg border ${
                data.historial_entrenamiento === op.id
                  ? 'border-accent bg-bg2'
                  : 'border-border bg-bg'
              }`}
            >
              <Text
                style={{
                  fontFamily: FONTS.bodyBold,
                  fontSize: 16,
                  color: data.historial_entrenamiento === op.id ? COLORS.accent : COLORS.text,
                }}
              >
                {op.label}
              </Text>
              <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textB, marginTop: 2 }}>
                {op.desc}
              </Text>
            </Pressable>
          ))}
        </View>

        <Input
          label="MESES INACTIVO"
          value={data.meses_inactivo > 0 ? String(data.meses_inactivo) : ''}
          onChangeText={(v) => setField('meses_inactivo', parseInt(v) || 0)}
          placeholder="¿Cuántos meses sin entrenar?"
          keyboardType="number-pad"
          className="mt-6"
        />

        <View className="flex-row gap-3 mt-8">
          <Button
            title="← ATRÁS"
            onPress={() => router.back()}
            variant="outline"
            className="flex-1"
          />
          <Button
            title="SIGUIENTE →"
            onPress={() => router.push('/(onboarding)/step-pruebas')}
            variant="primary"
            disabled={!canContinue}
            className="flex-1"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
