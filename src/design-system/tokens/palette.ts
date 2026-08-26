/**
 * Primitive palette.
 *
 * Do not consume these values from feature code.
 * Components should prefer semantic theme colors.
 */
export const palette = {
  brand: {
    nova: '#2AC29A',
    black: '#000000',
    white: '#FFFFFF',
    gradientStart: '#20B98E',
    gradientEnd: '#35CDA5',
  },

  nova: {
    50: '#EAFBF6',
    100: '#CEF5E9',
    200: '#9CEBD5',
    300: '#6AE0C0',
    400: '#43D2AB',
    500: '#2AC29A',
    600: '#1E9D7C',
    700: '#147A61',
    800: '#125E4C',
    900: '#104C3E',
    950: '#062D25',
  },

  neutral: {
    0: '#FFFFFF',
    50: '#F7FAF9',
    100: '#F0F5F3',
    150: '#E9F0ED',
    200: '#DCE5E1',
    300: '#B7C5BF',
    400: '#A6B0AC',
    500: '#74817B',
    600: '#53615B',
    700: '#35413C',
    800: '#222A27',
    900: '#111513',
    950: '#0B0F0E',
    1000: '#000000',
  },

  darkSurface: {
    background: '#0B0F0E',
    surface: '#121715',
    secondary: '#18201D',
    elevated: '#1D2622',
    pressed: '#26312D',
  },

  success: {
    50: '#ECFDF3',
    100: '#DDF7E9',
    300: '#92E9B9',
    400: '#51D58A',
    700: '#137A4C',
    900: '#10472F',
    950: '#08180F',
  },

  warning: {
    50: '#FFF8E8',
    100: '#FFF2D6',
    300: '#FFD98A',
    400: '#F2B84B',
    600: '#D88A16',
    900: '#603B00',
    950: '#241600',
  },

  danger: {
    50: '#FFF1F2',
    100: '#FDE4E7',
    300: '#FFB1B5',
    400: '#FF7A7A',
    700: '#B93845',
    900: '#6D1F28',
    950: '#230708',
  },

  info: {
    50: '#F2F6FF',
    100: '#E2ECFF',
    300: '#AFCBFF',
    400: '#6EA8FE',
    600: '#2F6FC7',
    900: '#173E79',
    950: '#071225',
  },
} as const;

export type Palette = typeof palette;
