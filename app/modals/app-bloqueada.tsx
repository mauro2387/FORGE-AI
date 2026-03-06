import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { isAppBlockedNow, formatBlockTimeRemaining, getTimeUntilUnblock } from '@/lib/appBlocker';
import { Button } from '@/components/ui/Button';
import { FONTS, COLORS } from '@/constants/theme';

export default function AppBloqueadaModal() {
  const { app } = useLocalSearchParams<{ app: string }>();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function updateTime() {
      // Default block config for display purposes
      const config = {
        app_package: app || '',
        app_nombre: app || '',
        horario_inicio: '06:00',
        horario_fin: '22:00',
        dias: [0, 1, 2, 3, 4, 5, 6],
        activo: true,
      };
      const remaining = getTimeUntilUnblock(config);
      setTimeLeft(formatBlockTimeRemaining(remaining));
    }
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [app]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
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

      <View style={{ marginTop: 32, padding: 24, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#0c0e12', alignItems: 'center' }}>
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

      <View style={{ marginTop: 32, width: '100%' }}>
        <Button
          title="VOLVER A FORGE"
          variant="primary"
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </View>
  );
}
