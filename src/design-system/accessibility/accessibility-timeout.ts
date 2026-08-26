import {
  AccessibilityInfo,
  Platform,
} from 'react-native';

/**
 * Respects Android's "Time to take action" accessibility preference.
 *
 * iOS/Web return the original duration. We never reduce the product's
 * requested timeout if a platform returns an unexpected smaller value.
 */
export const getAccessibleTimeout = async (
  originalTimeoutMs: number,
): Promise<number> => {
  const normalized = Math.max(
    0,
    Math.round(originalTimeoutMs),
  );

  if (Platform.OS !== 'android') {
    return normalized;
  }

  try {
    const recommended =
      await AccessibilityInfo.getRecommendedTimeoutMillis(
        normalized,
      );

    return Math.max(normalized, recommended);
  } catch {
    return normalized;
  }
};
