import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { formatBlockTimeRemaining, getTimeUntilUnblock } from '@/lib/appBlocker';
import { Button } from '@/components/ui/Button';
import { FONTS, COLORS } from '@/constants/theme';

export default function AppBloqueadaModal() {
  const { app } = useLocalSearchParams<{ app: string }>();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const remaining = getTimeUntilUnblock();
    setTimeLeft(formatBlockTimeRemaining(remaining));

    const interval = setInterval(() => {
      const r = getTimeUntilUnblock();
      setTimeLeft(formatBlockTimeRemaining(r));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 bg-bg items-center justify-center p-8">
      <Text style={{ fontSize: 72 }}>🚫</Text>

      <Text
        style={{
          fontFamily: FONTS.title,
          fontSize: 36,
          color: '#ef4444',
          textAlign: 'center',
          marginTop: 24,
        }}
      >
        APP BLOQUEADA
      </Text>

      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 14,
          color: COLORS.textB,
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        {app ? decodeURIComponent(app) : 'Esta aplicación'} está bloqueada
      </Text>

      <View className="mt-8 p-6 rounded-xl border border-border bg-bg2 items-center">
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
          SE DESBLOQUEA EN
        </Text>
        <Text
          style={{
            fontFamily: FONTS.title,
            fontSize: 48,
            color: COLORS.accent,
            marginTop: 8,
          }}
        >
          {timeLeft || '--:--'}
        </Text>
      </View>

      <Text
        style={{
          fontFamily: FONTS.body,
          fontSize: 14,
          color: COLORS.olive,
          textAlign: 'center',
          marginTop: 24,
          lineHeight: 20,
        }}
      >
        La disciplina es hacer lo correcto cuando nadie te está mirando.{'\n'}
        Volvé a entrenar, leer, o hacer algo productivo.
      </Text>

      <Button
        title="VOLVER A FORGE"
        variant="primary"
        onPress={() => router.replace('/(tabs)')}
        className="mt-8"
      />
    </View>
  );
}
