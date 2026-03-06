import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FONTS } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Completá email y contraseña.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error de acceso', error.message);
      return;
    }

    router.replace('/');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-12">
          <Text
            style={{ fontFamily: FONTS.title, fontSize: 56, color: '#c4a040' }}
          >
            FORGE
          </Text>
          <Text
            style={{ fontFamily: FONTS.mono, fontSize: 12, color: '#6b7b6e', marginTop: 4 }}
          >
            SISTEMA DE TRANSFORMACIÓN TOTAL
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="CONTRASEÑA"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
          />

          <Button
            title="INGRESAR"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            className="mt-4"
          />
        </View>

        <View className="flex-row items-center justify-center mt-8 gap-1">
          <Text style={{ fontFamily: FONTS.body, color: '#6b7b6e', fontSize: 14 }}>
            ¿No tenés cuenta?
          </Text>
          <Link href="/(auth)/register" asChild>
            <Text style={{ fontFamily: FONTS.body, color: '#c4a040', fontSize: 14 }}>
              REGISTRATE
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
