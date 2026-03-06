import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS, COLORS } from '@/constants/theme';
import type { FotoOnboarding } from '@/types/user.types';

const TIPOS_FOTO: { tipo: FotoOnboarding['tipo']; label: string; emoji: string }[] = [
  { tipo: 'FRENTE', label: 'Frente', emoji: '🧍' },
  { tipo: 'PERFIL', label: 'Perfil', emoji: '🧍‍♂️' },
  { tipo: 'ESPALDA', label: 'Espalda', emoji: '🔄' },
];

export default function StepFotos() {
  const { data, addFoto, removeFoto } = useOnboardingStore();

  async function tomarFoto(tipo: FotoOnboarding['tipo']) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'FORGE necesita acceso a la cámara para tus fotos de progreso.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      addFoto({ uri: result.assets[0].uri, tipo });
    }
  }

  function getFoto(tipo: FotoOnboarding['tipo']) {
    return data.fotos.find((f) => f.tipo === tipo);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      <ProgressBar progress={6 / 7} />

      <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent, marginTop: 24 }}>
        FOTOS DÍA 1
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.text, marginTop: 4, letterSpacing: 1 }}>
        PASO 6/7 — REGISTRO VISUAL INICIAL
      </Text>
      <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textB, marginTop: 8 }}>
        Sacate 3 fotos para medir tu progreso visualmente.
        Son privadas — solo vos las ves. Es opcional pero muy recomendado.
      </Text>

      <View style={{ gap: 16, marginTop: 32 }}>
        {TIPOS_FOTO.map(({ tipo, label, emoji }) => {
          const foto = getFoto(tipo);
          return (
            <Pressable
              key={tipo}
              onPress={() => tomarFoto(tipo)}
              style={{
                borderRadius: 14,
                borderWidth: 1,
                overflow: 'hidden',
                borderColor: foto ? COLORS.accent : COLORS.border,
              }}
            >
              {foto ? (
                <View>
                  <Image
                    source={{ uri: foto.uri }}
                    style={{ width: '100%', height: 200 }}
                    resizeMode="cover"
                  />
                  <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(6,7,8,0.8)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
                      ✓ {label}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => removeFoto(tipo)}
                    style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 }}
                  >
                    <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: '#fff' }}>
                      BORRAR
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                  <Text style={{ fontSize: 40 }}>{emoji}</Text>
                  <Text
                    style={{
                      fontFamily: FONTS.bodyBold,
                      fontSize: 14,
                      color: COLORS.textB,
                      marginTop: 8,
                    }}
                  >
                    FOTO {label.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 10,
                      color: COLORS.text,
                      marginTop: 4,
                    }}
                  >
                    Toca para tomar foto
                  </Text>
                </View>
              )}
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
            title="INICIAR FORGE →"
            onPress={() => router.push('/(onboarding)/step-procesando')}
            variant="primary"
          />
        </View>
      </View>
    </ScrollView>
  );
}
