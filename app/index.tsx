import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { CelestialOrb } from '../components/CelestialOrb';
import { colors, typography } from '../styles/theme';
import { storage, StorageKeys } from '../utils/storage';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Check onboarding status after animation
    const checkOnboarding = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500)); // Show splash for 2.5 seconds

      const completed = await storage.getItem<boolean>(StorageKeys.ONBOARDING_COMPLETED);

      if (completed) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    };

    checkOnboarding();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <CelestialOrb size={width * 1.5} variant="aurora" />
      </View>

      <View style={styles.content}>
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          Noor Halo
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
          Discover Your Inner Light
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.midnight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    ...typography.hero,
    fontSize: 56,
    color: colors.moonstone,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body1,
    color: colors.auroraTeal,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontSize: 14,
  },
});

export default SplashScreen;