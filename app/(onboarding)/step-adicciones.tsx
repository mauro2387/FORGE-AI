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
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      <ProgressBar progress={4 / 7} />

      <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent, marginTop: 24 }}>
        ADICCIONES
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.text, marginTop: 4, letterSpacing: 1 }}>
        PASO 4/7 — ENEMIGOS A ELIMINAR
      </Text>
      <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textB, marginTop: 8 }}>
        Seleccioná los hábitos que querés eliminar. FORGE va a trackear tus rachas de abstinencia.
        Es opcional — si no tenés ninguno, avanzá.
      </Text>

      <View style={{ gap: 12, marginTop: 32 }}>
        {ADICCIONES_DISPONIBLES.map((adiccion) => {
          const selected = data.adicciones.includes(adiccion.id);
          return (
            <Pressable
              key={adiccion.id}
              onPress={() => toggleAdiccion(adiccion.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: selected ? '#ef4444' : COLORS.border,
                backgroundColor: selected ? '#0c0e12' : COLORS.bg,
              }}
            >
              <Text style={{ fontSize: 24, marginRight: 12 }}>{adiccion.icono}</Text>
              <View style={{ flex: 1 }}>
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
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  borderWidth: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: selected ? '#ef4444' : COLORS.border,
                  backgroundColor: selected ? '#ef4444' : 'transparent',
                }}
              >
                {selected && (
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
            </Pressable>
          );
        })}
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
            onPress={() => router.push('/(onboarding)/step-bloqueos')}
            variant="primary"
          />
        </View>
      </View>
    </ScrollView>
  );
}
