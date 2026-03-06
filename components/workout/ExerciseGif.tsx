/**
 * ExerciseGif.tsx — GIF de ExerciseDB con fallback
 * Lazy loaded con placeholder
 * Dependencias: exerciseDb, NativeWind
 */

import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { getExerciseGif } from '@/lib/exerciseDb';
import { COLORS, FONTS } from '@/constants/theme';

interface ExerciseGifProps {
  exerciseDbId: string | null;
  nombre: string;
  size?: number;
}

export function ExerciseGif({ exerciseDbId, nombre, size = 120 }: ExerciseGifProps) {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!exerciseDbId) return;

    let cancelled = false;
    setLoading(true);
    setError(false);

    getExerciseGif(exerciseDbId)
      .then((url) => {
        if (!cancelled) {
          setGifUrl(url);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [exerciseDbId]);

  if (!exerciseDbId || error) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: COLORS.border, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textAlign: 'center', paddingHorizontal: 8 }} numberOfLines={2}>
          {nombre}
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: COLORS.border, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size="small" color="#c4a040" />
      </View>
    );
  }

  return (
    <View
      style={{ width: size, height: size, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border }}
    >
      {gifUrl ? (
        <Image
          source={{ uri: gifUrl }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text, textAlign: 'center', paddingHorizontal: 8 }} numberOfLines={2}>
            {nombre}
          </Text>
        </View>
      )}
    </View>
  );
}
