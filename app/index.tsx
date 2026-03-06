import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/userStore';
import { COLORS } from '@/constants/theme';
import type { Session } from '@supabase/supabase-js';

export default function Index() {
  const profile = useUserStore((s) => s.profile);
  const loading = useUserStore((s) => s.loading);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id).finally(() => setProfileChecked(true));
      } else {
        setProfileChecked(true);
      }
    });
  }, [fetchProfile]);

  // Still checking session
  if (session === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  // No session → login
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  // Still loading profile
  if (!profileChecked || loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={{ color: COLORS.textB, marginTop: 12, fontSize: 12 }}>
          Cargando perfil...
        </Text>
      </View>
    );
  }

  // No profile or onboarding not complete → onboarding
  if (!profile || !profile.onboarding_completo) {
    return <Redirect href="/(onboarding)/step-datos" />;
  }

  // All good → dashboard
  return <Redirect href="/(tabs)" />;
}
