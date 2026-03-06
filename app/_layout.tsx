import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/userStore';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
});

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const setProfile = useUserStore((s) => s.setProfile);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'BebasNeue': require('../assets/fonts/BebasNeue-Regular.ttf'),
          'ShareTechMono': require('../assets/fonts/ShareTechMono-Regular.ttf'),
          'BarlowCondensed-Regular': require('../assets/fonts/BarlowCondensed-Regular.ttf'),
          'BarlowCondensed-Medium': require('../assets/fonts/BarlowCondensed-Medium.ttf'),
          'BarlowCondensed-SemiBold': require('../assets/fonts/BarlowCondensed-SemiBold.ttf'),
          'BarlowCondensed-Bold': require('../assets/fonts/BarlowCondensed-Bold.ttf'),
        });
      } catch {
        // Fonts will use fallback
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          setProfile(data);
        } else {
          setProfile(null);
        }
      },
    );
    return () => subscription.unsubscribe();
  }, [setProfile]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#060708' },
            animation: 'fade',
          }}
        />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
