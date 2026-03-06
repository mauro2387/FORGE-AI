/**
 * ExerciseGif.tsx — GIF de ExerciseDB con fallback
 * Lazy loaded con placeholder
 * Dependencias: exerciseDb, NativeWind
 */

import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { getExerciseGif } from '@/lib/exerciseDb';

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
        style={{ width: size, height: size }}
        className="bg-border rounded-xl items-center justify-center"
      >
        <Text className="text-text font-mono text-xs text-center px-2" numberOfLines={2}>
          {nombre}
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{ width: size, height: size }}
        className="bg-border rounded-xl items-center justify-center"
      >
        <ActivityIndicator size="small" color="#c4a040" />
      </View>
    );
  }

  return (
    <View
      style={{ width: size, height: size }}
      className="rounded-xl overflow-hidden border border-border"
    >
      {gifUrl ? (
        <Image
          source={{ uri: gifUrl }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <View className="flex-1 bg-border items-center justify-center">
          <Text className="text-text font-mono text-xs text-center px-2" numberOfLines={2}>
            {nombre}
          </Text>
        </View>
      )}
    </View>
  );
}
