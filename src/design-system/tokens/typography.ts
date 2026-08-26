export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const typography = {
  displayLarge: {
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.4,
  },
  displayMedium: {
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.35,
  },
  headlineLarge: {
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  headlineMedium: {
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.2,
  },
  headlineSmall: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.15,
  },
  titleLarge: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.1,
  },
  titleMedium: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  titleSmall: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 17,
    lineHeight: 26,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.05,
  },
  labelLarge: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.15,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
