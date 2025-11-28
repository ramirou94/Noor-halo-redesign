import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/theme';

interface HaloGlowProps {
  size?: number;
  intensity?: 'low' | 'medium' | 'high';
}

const HaloGlow: React.FC<HaloGlowProps> = ({ size = 200, intensity = 'medium' }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    // Pulse animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const getOpacityByIntensity = () => {
    switch (intensity) {
      case 'low':
        return 0.3;
      case 'high':
        return 0.9;
      default:
        return 0.6;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, { width: size, height: size }]}>
        <LinearGradient
          colors={[colors.pinkHalo, colors.softPurpleGlow, 'transparent']}
          style={[
            styles.gradient,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              opacity: getOpacityByIntensity(),
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
  },
});

export default HaloGlow;