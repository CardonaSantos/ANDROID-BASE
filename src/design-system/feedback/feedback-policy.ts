import type {
  FeedbackPolicy,
  FeedbackTone,
} from './feedback.types';

/**
 * Default semantic feedback policy.
 *
 * IMPORTANT:
 * - `success` feedback happens after the operation actually succeeds, not just
 *   when the user taps the submit button.
 * - Validation errors that belong to a field should remain inline; this policy
 *   is for operation/global feedback.
 */
export const feedbackPolicy = {
  neutral: {
    mode: 'visual',
    haptic: 'none',
    duration: 'normal',
  },

  success: {
    mode: 'visual-haptic',
    haptic: 'success',
    duration: 'short',
  },

  warning: {
    mode: 'visual-haptic',
    haptic: 'warning',
    duration: 'long',
  },

  danger: {
    mode: 'visual-haptic',
    haptic: 'error',
    duration: 'long',
  },

  info: {
    mode: 'visual',
    haptic: 'none',
    duration: 'normal',
  },
} as const satisfies Record<FeedbackTone, FeedbackPolicy>;
