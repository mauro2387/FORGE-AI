/**
 * Input.tsx — Input de texto estilo FORGE
 * Dependencias: theme
 */

import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

export interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  error?: string;
  suffix?: string;
}

export function Input({ label, error, suffix, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? COLORS.danger
    : focused
      ? COLORS.accent
      : '#2a2e3a';

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.row}>
        <TextInput
          placeholderTextColor="#586068"
          selectionColor={COLORS.accent}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            {
              borderColor,
              borderWidth: focused ? 1.5 : 1,
            },
          ]}
          {...props}
        />
        {suffix && (
          <Text style={styles.suffix}>{suffix}</Text>
        )}
      </View>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    color: COLORS.accent,
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#0a0c10',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 16,
  },
  suffix: {
    color: COLORS.text,
    fontFamily: FONTS.mono,
    fontSize: 14,
    marginLeft: 8,
  },
  error: {
    color: COLORS.danger,
    fontFamily: FONTS.body,
    fontSize: 13,
  },
});
