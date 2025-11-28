import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../styles/theme';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.midnight,
          borderTopWidth: 0,
          elevation: 0,
          height: 85,
          paddingTop: 10,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : null
        ),
        tabBarActiveTintColor: colors.auroraTeal,
        tabBarInactiveTintColor: colors.stardust,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.ritual_of_day'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
              style={{ marginBottom: -5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: t('habits.title'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "checkmark-circle" : "checkmark-circle-outline"}
              size={size}
              color={color}
              style={{ marginBottom: -5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rituals"
        options={{
          title: t('rituals.title'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
              style={{ marginBottom: -5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: t('audio.title'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "musical-notes" : "musical-notes-outline"}
              size={size}
              color={color}
              style={{ marginBottom: -5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
              style={{ marginBottom: -5 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}