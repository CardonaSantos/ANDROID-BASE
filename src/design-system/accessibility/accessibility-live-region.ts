export type NovaLiveRegion =
  | 'off'
  | 'polite'
  | 'assertive';

/**
 * Maps NOVA semantics to React Native's Android live-region values.
 *
 * Future components may expose `liveRegion` semantically while keeping raw
 * platform strings out of feature code.
 */
export const toAccessibilityLiveRegion = (
  value: NovaLiveRegion,
): 'none' | 'polite' | 'assertive' => {
  switch (value) {
    case 'polite':
      return 'polite';

    case 'assertive':
      return 'assertive';

    case 'off':
    default:
      return 'none';
  }
};
