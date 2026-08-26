import { accessibility } from '../tokens';

export type ContrastUsage =
  | 'normalText'
  | 'largeText'
  | 'nonTextUi';

const normalizeHex = (
  color: string,
): string | null => {
  const value = color.trim().replace('#', '');

  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    return value
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }

  if (/^[0-9a-fA-F]{6}$/.test(value)) {
    return value;
  }

  return null;
};

const channelToLinear = (
  channel: number,
): number => {
  const srgb = channel / 255;

  return srgb <= 0.04045
    ? srgb / 12.92
    : ((srgb + 0.055) / 1.055) ** 2.4;
};

export const getRelativeLuminance = (
  hexColor: string,
): number => {
  const hex = normalizeHex(hexColor);

  if (!hex) {
    throw new Error(
      `Unsupported color "${hexColor}". Contrast utility expects #RGB or #RRGGBB.`,
    );
  }

  const r = channelToLinear(
    Number.parseInt(hex.slice(0, 2), 16),
  );
  const g = channelToLinear(
    Number.parseInt(hex.slice(2, 4), 16),
  );
  const b = channelToLinear(
    Number.parseInt(hex.slice(4, 6), 16),
  );

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const getContrastRatio = (
  foreground: string,
  background: string,
): number => {
  const foregroundLuminance =
    getRelativeLuminance(foreground);
  const backgroundLuminance =
    getRelativeLuminance(background);

  const lighter = Math.max(
    foregroundLuminance,
    backgroundLuminance,
  );
  const darker = Math.min(
    foregroundLuminance,
    backgroundLuminance,
  );

  return (lighter + 0.05) / (darker + 0.05);
};

export const meetsContrast = (
  foreground: string,
  background: string,
  usage: ContrastUsage = 'normalText',
): boolean =>
  getContrastRatio(foreground, background) >=
  accessibility.contrast[usage];

export const formatContrastRatio = (
  foreground: string,
  background: string,
): string =>
  `${getContrastRatio(
    foreground,
    background,
  ).toFixed(2)}:1`;
