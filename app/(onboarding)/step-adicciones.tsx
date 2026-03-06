import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ADICCIONES_DISPONIBLES } from '@/constants/config';
import { FONTS, COLORS } from '@/constants/theme';

export default function StepAdicciones() {
  const { data, toggleAdiccion } = useOnboardingStore();

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      <ProgressBar progress={4 / 7} />

      <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent, marginTop: 24 }}>
        ADICCIONES
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 4 }}>
        PASO 4/7 — ENEMIGOS A ELIMINAR
      </Text>
      <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textB, marginTop: 8 }}>
        Seleccioná los hábitos que querés eliminar. FORGE va a trackear tus rachas de abstinencia.
        Es opcional — si no tenés ninguno, avanzá.
      </Text>

      <View className="gap-3 mt-8">
        {ADICCIONES_DISPONIBLES.map((adiccion) => {
          const selected = data.adicciones.includes(adiccion.id);
          return (
            <Pressable
              key={adiccion.id}
              onPress={() => toggleAdiccion(adiccion.id)}
              className={`flex-row items-center p-4 rounded-lg border ${
                selected ? 'border-danger bg-bg2' : 'border-border bg-bg'
              }`}
            >
              <Text style={{ fontSize: 24, marginRight: 12 }}>{adiccion.icono}</Text>
              <View className="flex-1">
                <Text
                  style={{
                    fontFamily: FONTS.bodyBold,
                    fontSize: 16,
                    color: selected ? '#ef4444' : COLORS.text,
                  }}
                >
                  {adiccion.label}
                </Text>
              </View>
              <View
                className={`w-6 h-6 rounded border-2 items-center justify-center ${
                  selected ? 'border-danger bg-danger' : 'border-border'
                }`}
              >
                {selected && (
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row gap-3 mt-8">
        <Button
          title="← ATRÁS"
          onPress={() => router.back()}
          variant="outline"
          className="flex-1"
        />
        <Button
          title="SIGUIENTE →"
          onPress={() => router.push('/(onboarding)/step-bloqueos')}
          variant="primary"
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
}
