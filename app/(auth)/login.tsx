import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FONTS, COLORS } from '@/constants/theme';

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
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{ fontFamily: FONTS.title, fontSize: 64, color: COLORS.accent, letterSpacing: 4 }}>
            FORGE
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.text, marginTop: 4, letterSpacing: 2 }}>
            SISTEMA DE TRANSFORMACIÓN TOTAL
          </Text>
        </View>

        <View style={{ gap: 16 }}>
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

          <View style={{ marginTop: 8 }}>
            <Button
              title="INGRESAR"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32, gap: 6 }}>
          <Text style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 14 }}>
            ¿No tenés cuenta?
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={{ fontFamily: FONTS.bodyBold, color: COLORS.accent, fontSize: 14 }}>
                REGISTRATE
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
