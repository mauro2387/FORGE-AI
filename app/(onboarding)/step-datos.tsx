import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS } from '@/constants/theme';

export default function StepDatos() {
  const { data, setField } = useOnboardingStore();

  const canContinue =
    data.nombre.trim().length >= 2 &&
    data.edad > 0 &&
    data.peso_actual > 0 &&
    data.altura > 0 &&
    data.peso_objetivo > 0;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressBar progress={1 / 7} />

        <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: '#c4a040', marginTop: 24 }}>
          DATOS BÁSICOS
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: '#6b7b6e', marginTop: 4 }}>
          PASO 1/7 — IDENTIFICACIÓN DEL RECLUTA
        </Text>

        <View className="gap-4 mt-8">
          <Input
            label="NOMBRE"
            value={data.nombre}
            onChangeText={(v) => setField('nombre', v)}
            placeholder="Tu nombre"
            autoCapitalize="words"
          />

          <Input
            label="EDAD"
            value={data.edad > 0 ? String(data.edad) : ''}
            onChangeText={(v) => setField('edad', parseInt(v) || 0)}
            placeholder="17"
            keyboardType="number-pad"
          />

          <Input
            label="PESO ACTUAL (kg)"
            value={data.peso_actual > 0 ? String(data.peso_actual) : ''}
            onChangeText={(v) => setField('peso_actual', parseFloat(v) || 0)}
            placeholder="70"
            keyboardType="decimal-pad"
          />

          <Input
            label="ALTURA (cm)"
            value={data.altura > 0 ? String(data.altura) : ''}
            onChangeText={(v) => setField('altura', parseInt(v) || 0)}
            placeholder="175"
            keyboardType="number-pad"
          />

          <Input
            label="PESO OBJETIVO (kg)"
            value={data.peso_objetivo > 0 ? String(data.peso_objetivo) : ''}
            onChangeText={(v) => setField('peso_objetivo', parseFloat(v) || 0)}
            placeholder="75"
            keyboardType="decimal-pad"
          />
        </View>

        <Button
          title="SIGUIENTE →"
          onPress={() => router.push('/(onboarding)/step-historial')}
          variant="primary"
          disabled={!canContinue}
          className="mt-8"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
