import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
  return (
    <LinearGradient
      colors={[colors.nightSkyStart, colors.nightSkyEnd, colors.deepPurple]}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;