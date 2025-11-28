import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { I18nextProvider } from 'react-i18next';
import {
  useFonts,
  SpaceGrotesk_700Bold,
  SpaceGrotesk_600SemiBold
} from '@expo-google-fonts/space-grotesk';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold
} from '@expo-google-fonts/inter';
import i18n from '../i18n';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../contexts/AuthContext';
import { PremiumProvider } from '../contexts/PremiumContext';

// Keep splash screen visible while we check onboarding status
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'SpaceGrotesk-SemiBold': SpaceGrotesk_600SemiBold,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    // Fallback for Clash Display until we have the file
    'ClashDisplay-Medium': SpaceGrotesk_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <PremiumProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="quotes" />
            <Stack.Screen name="challenges" />
            <Stack.Screen name="mood" />
            <Stack.Screen name="noor-halo-plus" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="auth/forgot-password" />
            <Stack.Screen name="legal/mentions-legales" />
            <Stack.Screen name="legal/cgu" />
            <Stack.Screen name="legal/politique-confidentialite" />
          </Stack>
        </PremiumProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}