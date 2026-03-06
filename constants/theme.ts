/**
 * theme.ts — Colores, tipografías, espaciados del diseño FORGE
 * Estética militar/industrial, dark mode permanente
 * Dependencias: ninguna
 */

export const COLORS = {
  bg: '#060708',
  bg2: '#0c0e12',
  border: '#1c2030',
  accent: '#c4a040',
  olive: '#3d4f3a',
  'olive-l': '#587050',
  text: '#849098',
  'text-b': '#c0ccd4',
  white: '#e4eaf0',
  danger: '#922020',
  blue: '#2a7a9a',
  transparent: 'transparent',
  black: '#000000',
} as const;

export const FONTS = {
  bebas: 'BebasNeue',
  mono: 'ShareTechMono',
  barlow: 'BarlowCondensed-Regular',
  barlowMedium: 'BarlowCondensed-Medium',
  barlowBold: 'BarlowCondensed-Bold',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const TAB_BAR_HEIGHT = 80;
