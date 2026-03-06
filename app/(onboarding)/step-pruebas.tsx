import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS, COLORS } from '@/constants/theme';

export default function StepPruebas() {
  const { data, setPrueba } = useOnboardingStore();
  const p = data.pruebas_fisicas;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressBar progress={3 / 7} />

        <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent, marginTop: 24 }}>
          PRUEBAS FÍSICAS
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.text, marginTop: 4, letterSpacing: 1 }}>
          PASO 3/7 — EVALUACIÓN INICIAL
        </Text>
        <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textB, marginTop: 8 }}>
          Hacé cada ejercicio al máximo. Si no podés hacer alguno, poné 0. Esto calibra tu plan.
        </Text>

        <View style={{ gap: 16, marginTop: 32 }}>
          <Input
            label="FLEXIONES MÁXIMAS (sin parar)"
            value={p.flexiones_max > 0 ? String(p.flexiones_max) : ''}
            onChangeText={(v) => setPrueba('flexiones_max', parseInt(v) || 0)}
            placeholder="15"
            keyboardType="number-pad"
          />

          <Input
            label="DOMINADAS MÁXIMAS (sin parar)"
            value={p.dominadas_max > 0 ? String(p.dominadas_max) : ''}
            onChangeText={(v) => setPrueba('dominadas_max', parseInt(v) || 0)}
            placeholder="5"
            keyboardType="number-pad"
          />

          <Input
            label="TIEMPO 1KM (segundos)"
            value={p.tiempo_1km_seg > 0 ? String(p.tiempo_1km_seg) : ''}
            onChangeText={(v) => setPrueba('tiempo_1km_seg', parseInt(v) || 0)}
            placeholder="300 = 5 minutos"
            keyboardType="number-pad"
          />

          <Input
            label="PLANCHA (segundos)"
            value={p.plancha_seg > 0 ? String(p.plancha_seg) : ''}
            onChangeText={(v) => setPrueba('plancha_seg', parseInt(v) || 0)}
            placeholder="60"
            keyboardType="number-pad"
          />

          <Input
            label="SENTADILLAS MÁXIMAS (sin parar)"
            value={p.sentadillas_max > 0 ? String(p.sentadillas_max) : ''}
            onChangeText={(v) => setPrueba('sentadillas_max', parseInt(v) || 0)}
            placeholder="30"
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
              onPress={() => router.push('/(onboarding)/step-adicciones')}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
