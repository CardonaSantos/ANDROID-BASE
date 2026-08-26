import {
  AccessibilityInfo,
  Platform,
} from 'react-native';

import { accessibility } from '../tokens';
import type {
  AccessibilityAnnouncementPriority,
} from './accessibility.types';

let lastAnnouncement:
  | { message: string; timestamp: number }
  | undefined;

const shouldDeduplicate = (
  message: string,
): boolean => {
  const now = Date.now();

  if (
    lastAnnouncement?.message === message &&
    now - lastAnnouncement.timestamp <
      accessibility.announcement.dedupeWindowMs
  ) {
    return true;
  }

  lastAnnouncement = {
    message,
    timestamp: now,
  };

  return false;
};

const announce = (
  message: string,
  priority: AccessibilityAnnouncementPriority,
): void => {
  const normalized = message.trim();

  if (
    normalized.length === 0 ||
    shouldDeduplicate(normalized)
  ) {
    return;
  }

  try {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibilityWithOptions(
        normalized,
        {
          queue: priority === 'polite',
        },
      );

      return;
    }

    /**
     * React Native exposes the generic announcement API cross-platform.
     * Android live-region behavior is handled at component level when a
     * continuously updating region is more appropriate.
     */
    AccessibilityInfo.announceForAccessibility(
      normalized,
    );
  } catch {
    /**
     * Accessibility announcements are UX infrastructure and must never break
     * a business operation when a platform API is unavailable.
     */
  }
};

export const accessibilityAnnouncer = {
  polite(message: string): void {
    announce(message, 'polite');
  },

  assertive(message: string): void {
    announce(message, 'assertive');
  },
} as const;
