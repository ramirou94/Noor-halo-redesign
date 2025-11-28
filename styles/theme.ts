import { TextStyle } from 'react-native';

export const colors = {
  // Palette Principale - Aurora Nocturna
  midnight: '#0A0E27',
  deepSpace: '#1a1f3d',
  nebula: '#2D3561',

  // Accents
  auroraTeal: '#14F195',
  auroraViolet: '#9D4EDD',
  cosmicGold: '#F1BC5E',
  stellarBlue: '#4EA8DE',

  // Neutres
  moonstone: '#E8EFF5',
  stardust: '#B8C5D6',
  shadow: '#4A5568',
  cosmos: '#1E2938',

  // Fonctionnels
  success: '#14F195',
  warning: '#F1BC5E',
  error: '#FF6B9D',

  // Gradients
  gradients: {
    aurora: ['#14F195', '#9D4EDD', '#4EA8DE'],
    nightSky: ['#0A0E27', '#1a1f3d', '#2D3561'],
    starfield: ['#1a1f3d', '#0A0E27', '#1E2938'],
    moonlight: ['#E8EFF5', '#B8C5D6', '#4EA8DE'],
  },

  // Rétrocompatibilité (pour migration progressive)
  deepPurple: '#1a1f3d',        // Pointe vers deepSpace
  softPurpleGlow: '#9D4EDD',    // Pointe vers auroraViolet
  pinkHalo: '#14F195',          // Pointe vers auroraTeal
  white: '#E8EFF5',             // Pointe vers moonstone
  lightGray: '#B8C5D6',         // Pointe vers stardust
  mediumGray: '#4A5568',        // Pointe vers shadow
  darkGray: '#1E2938',          // Pointe vers cosmos
  black: '#0A0E27',             // Pointe vers midnight

  // UI Elements (Legacy mappings)
  cardBackground: 'rgba(26, 31, 61, 0.6)', // deepSpace with opacity
  cardBorder: 'rgba(157, 78, 221, 0.3)',   // auroraViolet with opacity
  glowShadow: 'rgba(20, 241, 149, 0.4)',   // auroraTeal with opacity
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 12,
  md: 18,
  lg: 24,
  full: 9999,
};

// Typography with Custom Fonts
export const typography = {
  // Titles
  title1: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 40,
    color: colors.moonstone,
  },
  title2: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 32,
    color: colors.moonstone,
  },
  title3: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 28,
    color: colors.moonstone,
  },

  // Body
  body1: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
    color: colors.stardust,
  },
  body2: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
    color: colors.stardust,
  },
  caption: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 16,
    color: colors.shadow,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },

  // Special
  button: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
    color: colors.midnight,
  },

  // New Semantic Styles
  hero: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 48,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 56,
    letterSpacing: -1.5,
    color: colors.moonstone,
  },
  accent: {
    fontFamily: 'ClashDisplay-Medium', // Fallback to SpaceGrotesk-SemiBold defined in _layout
    fontSize: 28,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 36,
    letterSpacing: -0.5,
    color: colors.auroraTeal,
  },
};

export const shadows = {
  small: {
    shadowColor: colors.auroraViolet,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.auroraViolet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.auroraViolet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.auroraTeal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export default theme;