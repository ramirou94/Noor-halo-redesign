import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, typography, spacing, shadows } from '../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      height: getButtonHeight(),
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
    };

    if (disabled) {
      return [styles.button, baseStyle, styles.disabled, style];
    }

    switch (variant) {
      case 'secondary':
        return [styles.button, baseStyle, styles.secondary, style];
      case 'outline':
        return [styles.button, baseStyle, styles.outline, style];
      default:
        return [styles.button, baseStyle, style];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, textStyle];
    if (variant === 'outline') {
      return [baseTextStyle, styles.outlineText];
    }
    return baseTextStyle;
  };

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.softPurpleGlow, colors.pinkHalo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={getButtonStyle()}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={getTextStyle()}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.softPurpleGlow : colors.white} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  text: {
    ...typography.button,
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.deepPurple,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.softPurpleGlow,
  },
  outlineText: {
    color: colors.softPurpleGlow,
  },
  disabled: {
    backgroundColor: colors.darkGray,
    opacity: 0.5,
  },
});

export default Button;