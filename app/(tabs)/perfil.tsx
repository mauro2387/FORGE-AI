import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONTS, COLORS } from '@/constants/theme';

export default function PerfilScreen() {
  const profile = useUserStore((s) => s.profile);
  const signOut = useUserStore((s) => s.signOut);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const [fotos, setFotos] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from('body_photos')
      .select('*')
      .eq('user_id', profile.id)
      .order('semana_numero', { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data) setFotos(data);
      });
  }, [profile?.id]);

  if (!profile) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: FONTS.body, color: COLORS.textB }}>Cargando perfil...</Text>
      </View>
    );
  }

  const faseLabel: Record<string, string> = {
    FASE_1: 'FASE 1 — REACTIVACIÓN',
    FASE_2: 'FASE 2 — CONSTRUCCIÓN',
    FASE_3: 'FASE 3 — COMBATE',
    FASE_4: 'FASE 4 — ÉLITE',
  };

  const progresoPeso = profile.peso_objetivo === profile.peso_actual ? 1 : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 32 }}
    >
      {/* Header */}
      <View style={{ alignItems: 'center' }}>
        <Avatar name={profile.nombre} size={80} />
        <Text
          style={{
            fontFamily: FONTS.title,
            fontSize: 28,
            color: COLORS.accent,
            marginTop: 12,
          }}
        >
          {profile.nombre.toUpperCase()}
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 2 }}>
          {faseLabel[profile.fase_actual] || 'FASE 1'} — SEMANA {profile.semana_programa}
        </Text>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Card>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent }}>PESO</Text>
              <Text style={{ fontFamily: FONTS.title, fontSize: 28, color: COLORS.text }}>
                {profile.peso_actual}
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textB }}>
                kg → {profile.peso_objetivo}kg
              </Text>
            </View>
          </Card>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Card>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent }}>ALTURA</Text>
              <Text style={{ fontFamily: FONTS.title, fontSize: 28, color: COLORS.text }}>
                {profile.altura}
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textB }}>cm</Text>
            </View>
          </Card>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Card>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent }}>EDAD</Text>
              <Text style={{ fontFamily: FONTS.title, fontSize: 28, color: COLORS.text }}>
                {profile.edad}
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textB }}>años</Text>
            </View>
          </Card>
        </View>
      </View>

      {/* Macros */}
      <View style={{ marginTop: 16 }}>
        <Card>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, marginBottom: 8 }}>
            OBJETIVOS NUTRICIONALES
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.title, fontSize: 22, color: COLORS.text }}>
                {profile.calorias_objetivo}
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.textB }}>KCAL</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.title, fontSize: 22, color: COLORS.accent }}>
                {profile.proteina_g}g
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.textB }}>PROT</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.title, fontSize: 22, color: COLORS.olive }}>
                {profile.carbos_g}g
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.textB }}>CARBS</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.title, fontSize: 22, color: COLORS.textB }}>
                {profile.grasas_g}g
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.textB }}>GRASAS</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Análisis físico */}
      {profile.analisis_fisico && (
        <View style={{ marginTop: 16 }}>
          <Card>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, marginBottom: 8 }}>
              ANÁLISIS FÍSICO
            </Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.text }}>
              Nivel: {profile.analisis_fisico.nivel_fitness}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.body,
                fontSize: 13,
                color: COLORS.textB,
                marginTop: 4,
              }}
            >
              Grasa estimada: {profile.analisis_fisico.estimacion_grasa_corporal}%
            </Text>
            <Text
              style={{
                fontFamily: FONTS.body,
                fontSize: 12,
                color: COLORS.olive,
                marginTop: 8,
              }}
            >
              {profile.analisis_fisico.plan_resumen}
            </Text>
          </Card>
        </View>
      )}

      {/* Gym mode toggle */}
      <View style={{ marginTop: 16 }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent }}>
                MODO GYM
              </Text>
              <Text style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textB, marginTop: 2 }}>
                Activa ejercicios con pesas y máquinas
              </Text>
            </View>
            <Switch
              value={profile.tiene_gym}
              onValueChange={(value) => updateProfile({ tiene_gym: value })}
              trackColor={{ false: COLORS.border, true: COLORS.olive }}
              thumbColor={profile.tiene_gym ? COLORS.accent : COLORS.textB}
            />
          </View>
        </Card>
      </View>

      {/* Fotos de progreso */}
      {fotos.length > 0 && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, marginBottom: 8 }}>
            FOTOS DE PROGRESO
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {fotos.map((foto, idx) => (
                <View key={idx} style={{ alignItems: 'center' }}>
                  <View style={{
                    borderRadius: 10,
                    backgroundColor: '#0c0e12',
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    width: 96,
                    height: 128,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textB }}>
                      S{foto.semana_numero as number}
                    </Text>
                    <Text style={{ fontSize: 24, marginTop: 4 }}>📷</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Actions */}
      <View style={{ gap: 12, marginTop: 32 }}>
        <Button
          title="📸 FOTO SEMANAL"
          variant="outline"
          onPress={() => router.push('/modals/foto-semanal')}
        />
        <Button
          title="CERRAR SESIÓN"
          variant="outline"
          onPress={() => {
            Alert.alert('Cerrar sesión', '¿Seguro que querés salir?', [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Salir',
                style: 'destructive',
                onPress: async () => {
                  await signOut();
                  router.replace('/(auth)/login');
                },
              },
            ]);
          }}
        />
      </View>
    </ScrollView>
  );
}
