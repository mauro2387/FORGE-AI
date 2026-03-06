import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FONTS, COLORS } from '@/constants/theme';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Completá todos los campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { data: authData, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    

    if (error) {
      setLoading(false);
      Alert.alert('Error de registro', error.message);
      return;
    }

    // Create initial user_profiles row
    if (authData.user) {
      await supabase.from('user_profiles').upsert({
        id: authData.user.id,
        email: email.trim(),
        onboarding_completo: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    }

    setLoading(false);
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
            CREÁ TU CUENTA DE COMBATE
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
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            autoComplete="new-password"
          />

          <Input
            label="CONFIRMAR CONTRASEÑA"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repetí la contraseña"
            secureTextEntry
            autoComplete="new-password"
          />

          <View style={{ marginTop: 8 }}>
            <Button
              title="ENLISTARSE"
              onPress={handleRegister}
              loading={loading}
              variant="primary"
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32, gap: 6 }}>
          <Text style={{ fontFamily: FONTS.body, color: COLORS.text, fontSize: 14 }}>
            ¿Ya tenés cuenta?
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={{ fontFamily: FONTS.bodyBold, color: COLORS.accent, fontSize: 14 }}>
                INGRESÁ
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
