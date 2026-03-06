import { useEffect, useState, useRef } from 'react';
import { View, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useUserStore } from '@/stores/userStore';
import { usePlanStore } from '@/stores/planStore';
import { analizarOnboarding } from '@/lib/claude';
import { supabase } from '@/lib/supabase';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS, COLORS } from '@/constants/theme';

const MENSAJES = [
  'Analizando datos del recluta...',
  'Evaluando capacidades físicas...',
  'Calibrando programa de entrenamiento...',
  'Diseñando plan nutricional...',
  'Configurando sistema de disciplina...',
  'Preparando semana 1...',
  'Inicializando FORGE...',
];

export default function StepProcesando() {
  const { data, reset } = useOnboardingStore();
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const fetchPlanActual = usePlanStore((s) => s.fetchPlanActual);
  const [mensajeIdx, setMensajeIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const processingRef = useRef(false);

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setMensajeIdx((prev) => (prev + 1) % MENSAJES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (processingRef.current) return;
    processingRef.current = true;

    async function processOnboarding() {
      try {
        // Simulated progress while waiting for API
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 0.05, 0.9));
        }, 800);

        // Upload fotos if any
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No session');

        for (const foto of data.fotos) {
          const ext = foto.uri.split('.').pop() || 'jpg';
          const path = `${session.user.id}/${foto.tipo.toLowerCase()}_inicial.${ext}`;
          const response = await fetch(foto.uri);
          const blob = await response.blob();
          await supabase.storage.from('body-photos').upload(path, blob, {
            contentType: `image/${ext}`,
            upsert: true,
          });
        }

        // Call Edge Function
        const aiRequest = {
          nombre: data.nombre,
          edad: data.edad,
          peso_actual: data.peso_actual,
          altura: data.altura,
          peso_objetivo: data.peso_objetivo,
          historial_entrenamiento: data.historial_entrenamiento,
          meses_inactivo: data.meses_inactivo,
          pruebas_fisicas: data.pruebas_fisicas,
          adicciones: data.adicciones,
          tiene_fotos: data.fotos.length > 0,
        };
        const result = await analizarOnboarding(aiRequest);

        clearInterval(progressInterval);
        setProgress(1);

        // Mark onboarding complete
        await supabase
          .from('user_profiles')
          .update({ onboarding_completo: true })
          .eq('id', session.user.id);

        // Refresh stores
        await fetchProfile(session.user.id);
        await fetchPlanActual(session.user.id);

        // Clean up onboarding state
        reset();

        // Navigate to main app
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setError(msg);
        setProgress(0);
      }
    }

    processOnboarding();
  }, [data, fetchProfile, fetchPlanActual, reset]);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 48 }}>⚠️</Text>
        <Text
          style={{
            fontFamily: FONTS.title,
            fontSize: 24,
            color: '#ef4444',
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          ERROR
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
          {error}
        </Text>
        <View style={{ marginTop: 32, width: '100%' }}>
          <Text
            onPress={() => {
              setError(null);
              setProgress(0);
              processingRef.current = false;
            }}
            style={{
              fontFamily: FONTS.bodyBold,
              fontSize: 16,
              color: COLORS.accent,
              textAlign: 'center',
            }}
          >
            REINTENTAR
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Animated.View style={pulseStyle}>
        <Text style={{ fontSize: 64, textAlign: 'center' }}>⚒️</Text>
      </Animated.View>

      <Text
        style={{
          fontFamily: FONTS.title,
          fontSize: 36,
          color: COLORS.accent,
          marginTop: 24,
          textAlign: 'center',
        }}
      >
        FORJANDO
      </Text>

      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 12,
          color: COLORS.textB,
          marginTop: 8,
          textAlign: 'center',
        }}
      >
        {MENSAJES[mensajeIdx]}
      </Text>

      <View style={{ width: '100%', marginTop: 32 }}>
        <ProgressBar progress={progress} />
      </View>

      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          color: COLORS.textB,
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        {Math.round(progress * 100)}% COMPLETADO
      </Text>
    </View>
  );
}
