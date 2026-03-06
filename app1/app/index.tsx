import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/userStore';
import type { Session } from '@supabase/supabase-js';

export default function Index() {
  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id);
      }
    });
  }, [fetchProfile]);

  if (session === undefined) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color="#c4a040" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (profile && !profile.onboarding_completo) {
    return <Redirect href="/(onboarding)/step-datos" />;
  }

  return <Redirect href="/(tabs)" />;
}
