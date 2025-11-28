import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../styles/theme';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
  backgroundColor?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 24,
  color = colors.white,
  style,
  backgroundColor = colors.cardBackground,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
});

export default IconButton;