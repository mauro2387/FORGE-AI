/**
 * Input.tsx — Input de texto estilo FORGE
 * Dependencias: NativeWind
 */

import React, { useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import type { TextInputProps } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  error?: string;
  suffix?: string;
}

export function Input({ label, error, suffix, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1">
      {label && (
        <Text className="text-text font-mono text-xs uppercase tracking-widest">
          {label}
        </Text>
      )}
      <View className="flex-row items-center">
        <TextInput
          placeholderTextColor="#849098"
          selectionColor="#c4a040"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            flex-1 bg-bg border rounded-lg px-4 py-3
            text-white font-barlow text-base
            ${focused ? 'border-accent' : 'border-border'}
            ${error ? 'border-danger' : ''}
          `}
          {...props}
        />
        {suffix && (
          <Text className="text-text font-mono text-sm ml-2">{suffix}</Text>
        )}
      </View>
      {error && (
        <Text className="text-danger font-barlow text-sm">{error}</Text>
      )}
    </View>
  );
}
