import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { APPS_POPULARES } from '@/lib/appBlocker';
import { FONTS, COLORS } from '@/constants/theme';
import type { AppBloqueo } from '@/types/user.types';

export default function StepBloqueos() {
  const { data, addBloqueo, removeBloqueo } = useOnboardingStore();
  const [horaInicio, setHoraInicio] = useState('06:00');
  const [horaFin, setHoraFin] = useState('22:00');

  function handleToggleApp(app: { package_name: string; nombre: string; icono: string }) {
    const existe = data.apps_bloquear.find((b) => b.app_package === app.package_name);
    if (existe) {
      removeBloqueo(app.package_name);
    } else {
      const bloqueo: AppBloqueo = {
        app_package: app.package_name,
        app_nombre: app.nombre,
        horario_inicio: horaInicio,
        horario_fin: horaFin,
        dias: [0, 1, 2, 3, 4, 5, 6],
        activo: true,
      };
      addBloqueo(bloqueo);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      <ProgressBar progress={5 / 7} />

      <Text style={{ fontFamily: FONTS.title, fontSize: 32, color: COLORS.accent, marginTop: 24 }}>
        BLOQUEO DE APPS
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.text, marginTop: 4, letterSpacing: 1 }}>
        PASO 5/7 — ELIMINACIÓN DE DISTRACCIONES
      </Text>
      <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textB, marginTop: 8 }}>
        Seleccioná las apps que querés bloquear durante tus horarios productivos.
        Es opcional — requiere permisos especiales en Android.
      </Text>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
        <View style={{ flex: 1 }}>
          <Input
            label="DESDE"
            value={horaInicio}
            onChangeText={setHoraInicio}
            placeholder="06:00"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="HASTA"
            value={horaFin}
            onChangeText={setHoraFin}
            placeholder="22:00"
          />
        </View>
      </View>

      <View style={{ gap: 8, marginTop: 24 }}>
        {APPS_POPULARES.map((app) => {
          const selected = data.apps_bloquear.some((b) => b.app_package === app.package_name);
          return (
            <Pressable
              key={app.package_name}
              onPress={() => handleToggleApp(app)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: selected ? COLORS.accent : COLORS.border,
                backgroundColor: selected ? '#0c0e12' : COLORS.bg,
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>{app.icono}</Text>
              <Text
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 14,
                  color: selected ? COLORS.accent : COLORS.text,
                  flex: 1,
                }}
              >
                {app.nombre}
              </Text>
              {selected && (
                <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textB }}>
                  {horaInicio}–{horaFin}
                </Text>
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
            title="SIGUIENTE →"
            onPress={() => router.push('/(onboarding)/step-fotos')}
            variant="primary"
          />
        </View>
      </View>
    </ScrollView>
  );
}
