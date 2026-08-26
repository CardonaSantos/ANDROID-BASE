import type { AccessibilityRole } from 'react-native';

import { accessibility } from '../tokens';

/**
 * Shared role vocabulary for future NOVA components.
 *
 * The reusable component owns its default role. Features should generally
 * provide meaning (label/hint) rather than re-declaring the component role.
 */
export const accessibilityRolePolicy = {
  button: 'button',
  link: 'link',
  checkbox: 'checkbox',
  radio: 'radio',
  radioGroup: 'radiogroup',
  comboBox: 'combobox',
  header: 'header',
  image: 'image',
  imageButton: 'imagebutton',
  progressBar: 'progressbar',
  search: 'search',
  adjustable: 'adjustable',
  alert: 'alert',
} as const satisfies Record<string, AccessibilityRole>;

export const accessibilityPolicy = {
  standard: 'WCAG 2.2 AA',

  contrast: accessibility.contrast,

  touchTarget: accessibility.touchTarget,

  focus: {
    visible: true,
    width: accessibility.focusRing.width,
    offset: accessibility.focusRing.offset,
  },

  color: {
    /**
     * Status/information may never be communicated by color alone.
     * Pair semantic color with text, iconography and/or accessibility state.
     */
    mayBeOnlySignal: false,
  },

  typography: {
    allowFontScaling: true,
    globalMaxFontSizeMultiplier: undefined,
  },

  hints: {
    /**
     * Hints explain non-obvious outcomes. They must not merely repeat labels.
     */
    onlyWhenOutcomeIsNotObvious: true,
  },

  labels: {
    /**
     * Do not include the role in the accessible name:
     * "Comprar", not "Botón comprar".
     */
    includeRoleInLabel: false,
  },

  gestures: {
    /**
     * Swipe/drag interactions must expose a simple alternative action when
     * the gesture itself is not essential to the feature.
     */
    requireNonGestureAlternative: true,
  },

  decorativeContent: {
    hiddenFromAccessibilityTreeByDefault: true,
  },

  experimentalApis: {
    accessibilityOrder: false,
  },
} as const;
