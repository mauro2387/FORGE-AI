/**
 * Timer.tsx — Display de timer con sonido y vibración
 * Dependencias: useTimer, theme
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ProgressBar } from './ProgressBar';
import { COLORS, FONTS } from '@/constants/theme';

interface TimerDisplayProps {
  formatTiempo: string;
  progreso: number;
  corriendo: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip?: () => void;
  label?: string;
}

export function TimerDisplay({
  formatTiempo,
  progreso,
  corriendo,
  onStart,
  onPause,
  onReset,
  onSkip,
  label,
}: TimerDisplayProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Text style={styles.time}>{formatTiempo}</Text>

      <View style={styles.barWrap}>
        <ProgressBar progress={progreso} height={4} />
      </View>

      <View style={styles.buttons}>
        {corriendo ? (
          <TouchableOpacity onPress={onPause} style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>PAUSA</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onStart} style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>INICIAR</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onReset} style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>RESET</Text>
        </TouchableOpacity>

        {onSkip && (
          <TouchableOpacity onPress={onSkip} style={styles.btnOutline}>
            <Text style={styles.btnSecondaryText}>SKIP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  label: {
    color: COLORS.text,
    fontFamily: FONTS.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  time: {
    color: COLORS.accent,
    fontFamily: FONTS.bebas,
    fontSize: 60,
    letterSpacing: 2,
  },
  barWrap: {
    width: '100%',
    paddingHorizontal: 32,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnPrimaryText: {
    color: COLORS.bg,
    fontFamily: FONTS.mono,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  btnSecondary: {
    backgroundColor: '#1e2433',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnSecondaryText: {
    color: COLORS.textB,
    fontFamily: FONTS.mono,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1e2433',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
