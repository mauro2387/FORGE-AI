import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { COLORS, FONTS, TAB_BAR_HEIGHT } from '@/constants/theme';

type TabIconProps = {
  label: string;
  emoji: string;
  focused: boolean;
};

function TabIcon({ label, emoji, focused }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-2">
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9,
          color: focused ? COLORS.accent : COLORS.textB,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg2,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: TAB_BAR_HEIGHT,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textB,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="BASE" emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="entrenamiento"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="COMBATE" emoji="⚔️" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="habitos"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="DISCIPLINA" emoji="🎯" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutricion"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="RACIÓN" emoji="🍖" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="PERFIL" emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
