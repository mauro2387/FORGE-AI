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
      style={{ flex: 1, backgroundColor: COLORS.bg }}
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
        <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.text, marginTop: 4, letterSpacing: 1 }}>
          PASO 2/7 — EXPERIENCIA PREVIA
        </Text>

        <View style={{ gap: 12, marginTop: 32 }}>
          {OPCIONES_HISTORIAL.map((op) => {
            const selected = data.historial_entrenamiento === op.id;
            return (
              <Pressable
                key={op.id}
                onPress={() => setField('historial_entrenamiento', op.id)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: selected ? 1.5 : 1,
                  borderColor: selected ? COLORS.accent : '#1e2433',
                  backgroundColor: selected ? '#0e1117' : COLORS.bg,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.bodyBold,
                    fontSize: 16,
                    color: selected ? COLORS.accent : COLORS.textB,
                  }}
                >
                  {op.label}
                </Text>
                <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.text, marginTop: 2 }}>
                  {op.desc}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 24 }}>
          <Input
            label="MESES INACTIVO"
            value={data.meses_inactivo > 0 ? String(data.meses_inactivo) : ''}
            onChangeText={(v) => setField('meses_inactivo', parseInt(v) || 0)}
            placeholder="¿Cuántos meses sin entrenar?"
            keyboardType="number-pad"
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
          <View style={{ flex: 1 }}>
            <Button
              title="← ATRÁS"
              onPress={() => router.back()}
              variant="outline"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="SIGUIENTE →"
              onPress={() => router.push('/(onboarding)/step-pruebas')}
              variant="primary"
              disabled={!canContinue}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
