import type {
  AccessibilityState,
  AccessibilityValue,
} from 'react-native';

import type {
  AccessibilityRangeValueInput,
  AccessibilitySemanticStateInput,
} from './accessibility.types';

/**
 * Builds the exact state object consumed by React Native accessibility APIs.
 *
 * Future AppButton/AppCheckbox/AppAccordion components should use this helper
 * rather than constructing slightly different state semantics independently.
 */
export const buildAccessibilityState = (
  input: AccessibilitySemanticStateInput,
): AccessibilityState => ({
  disabled: input.disabled,
  selected: input.selected,
  checked: input.checked,
  busy: input.busy,
  expanded: input.expanded,
});

/**
 * Builds range/value semantics for sliders, progress, quantity selectors, etc.
 * If `text` is supplied React Native assistive technology can prefer the
 * textual representation over the numeric range.
 */
export const buildAccessibilityValue = (
  input: AccessibilityRangeValueInput,
): AccessibilityValue => ({
  min: input.min,
  max: input.max,
  now: input.now,
  text: input.text,
});
