import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, COLORS } from '@/constants/theme';

type FotoSemanal = {
  uri: string;
  tipo: 'FRENTE' | 'PERFIL' | 'ESPALDA';
};

export default function FotoSemanalModal() {
  const profile = useUserStore((s) => s.profile);
  const [fotos, setFotos] = useState<FotoSemanal[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  async function tomarFoto(tipo: FotoSemanal['tipo']) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'FORGE necesita la cámara para las fotos de progreso.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFotos((prev) => [
        ...prev.filter((f) => f.tipo !== tipo),
        { uri: result.assets[0].uri, tipo },
      ]);
    }
  }

  async function handleUpload() {
    if (!profile?.id || fotos.length === 0) return;

    setUploading(true);
    try {
      const semana = profile.semana_programa || 1;
      const fecha = new Date().toISOString().split('T')[0];

      for (const foto of fotos) {
        const ext = foto.uri.split('.').pop() || 'jpg';
        const path = `${profile.id}/semana_${semana}_${foto.tipo.toLowerCase()}_${fecha}.${ext}`;
        const response = await fetch(foto.uri);
        const blob = await response.blob();
        await supabase.storage.from('body-photos').upload(path, blob, {
          contentType: `image/${ext}`,
          upsert: true,
        });
      }

      // Save body_photos record
      await supabase.from('body_photos').insert({
        user_id: profile.id,
        semana_numero: semana,
        foto_frente_path: fotos.find((f) => f.tipo === 'FRENTE')
          ? `${profile.id}/semana_${semana}_frente_${fecha}.jpg`
          : null,
        foto_perfil_path: fotos.find((f) => f.tipo === 'PERFIL')
          ? `${profile.id}/semana_${semana}_perfil_${fecha}.jpg`
          : null,
        foto_espalda_path: fotos.find((f) => f.tipo === 'ESPALDA')
          ? `${profile.id}/semana_${semana}_espalda_${fecha}.jpg`
          : null,
      });

      setUploaded(true);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron subir las fotos. Intentá de nuevo.');
    } finally {
      setUploading(false);
    }
  }

  if (uploaded) {
    return (
      <View className="flex-1 bg-bg items-center justify-center p-8">
        <Text style={{ fontSize: 64 }}>📸</Text>
        <Text
          style={{
            fontFamily: FONTS.title,
            fontSize: 28,
            color: COLORS.accent,
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          FOTOS GUARDADAS
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
          Semana {profile?.semana_programa || 1} registrada. Seguí forjándote.
        </Text>
        <Button
          title="CERRAR"
          variant="primary"
          onPress={() => router.back()}
          className="mt-8"
        />
      </View>
    );
  }

  const TIPOS: { tipo: FotoSemanal['tipo']; label: string }[] = [
    { tipo: 'FRENTE', label: 'FRENTE' },
    { tipo: 'PERFIL', label: 'PERFIL' },
    { tipo: 'ESPALDA', label: 'ESPALDA' },
  ];

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.textB }}>
          ← CERRAR
        </Text>
      </Pressable>

      <Text
        style={{
          fontFamily: FONTS.title,
          fontSize: 32,
          color: COLORS.accent,
          marginTop: 16,
        }}
      >
        FOTO SEMANAL
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textB, marginTop: 2 }}>
        SEMANA {profile?.semana_programa || 1} — REGISTRO VISUAL
      </Text>

      <View className="gap-4 mt-8">
        {TIPOS.map(({ tipo, label }) => {
          const foto = fotos.find((f) => f.tipo === tipo);
          return (
            <Pressable
              key={tipo}
              onPress={() => tomarFoto(tipo)}
              className={`rounded-xl border overflow-hidden ${
                foto ? 'border-accent' : 'border-border'
              }`}
            >
              {foto ? (
                <Image
                  source={{ uri: foto.uri }}
                  style={{ width: '100%', height: 180 }}
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center justify-center p-8">
                  <Text style={{ fontFamily: FONTS.bodyBold, fontSize: 14, color: COLORS.textB }}>
                    📷 FOTO {label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Button
        title="SUBIR FOTOS"
        variant="primary"
        loading={uploading}
        disabled={fotos.length === 0}
        onPress={handleUpload}
        className="mt-8 mb-8"
      />
    </ScrollView>
  );
}
