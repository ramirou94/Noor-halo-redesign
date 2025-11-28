import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({ children, style, glow = false }) => {
  return (
    <View style={[styles.card, glow && styles.glowCard, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.medium,
  },
  glowCard: {
    ...shadows.glow,
  },
});

export default Card;