import {
  AccessibilityInfo,
  AppState,
  Platform,
  type AppStateStatus,
} from 'react-native';

import type { AccessibilitySnapshot } from './accessibility.types';

type Listener = () => void;

/**
 * AccessibilityInfo and AppState both return removable subscriptions, but
 * React Native exposes different concrete subscription types for those APIs.
 *
 * NOVA only needs the public cleanup contract.
 */
interface RemovableSubscription {
  remove(): void;
}

const initialSnapshot: AccessibilitySnapshot = {
  ready: false,

  screenReaderEnabled: false,
  accessibilityServiceEnabled: false,

  reduceMotionEnabled: false,
  reduceTransparencyEnabled: false,

  highTextContrastEnabled: false,
  darkerSystemColorsEnabled: false,
  prefersIncreasedContrast: false,

  boldTextEnabled: false,
  invertColorsEnabled: false,
  grayscaleEnabled: false,

  prefersCrossFadeTransitions: false,
};

let snapshot: AccessibilitySnapshot = initialSnapshot;
let started = false;

const listeners = new Set<Listener>();
const nativeSubscriptions: RemovableSubscription[] = [];

const emit = (): void => {
  listeners.forEach((listener) => listener());
};

const commit = (
  patch: Partial<AccessibilitySnapshot>,
): void => {
  const next: AccessibilitySnapshot = {
    ...snapshot,
    ...patch,
  };

  next.prefersIncreasedContrast =
    next.highTextContrastEnabled ||
    next.darkerSystemColorsEnabled;

  const changed =
    JSON.stringify(next) !== JSON.stringify(snapshot);

  if (!changed) {
    return;
  }

  snapshot = next;
  emit();
};

const addSubscription = (
  subscription: RemovableSubscription,
): void => {
  nativeSubscriptions.push(subscription);
};

const safeBoolean = async (
  read: () => Promise<boolean>,
): Promise<boolean> => {
  try {
    return await read();
  } catch {
    return false;
  }
};

const readPlatformSnapshot =
  async (): Promise<AccessibilitySnapshot> => {
    const [
      screenReaderEnabled,
      reduceMotionEnabled,
    ] = await Promise.all([
      safeBoolean(() =>
        AccessibilityInfo.isScreenReaderEnabled(),
      ),
      safeBoolean(() =>
        AccessibilityInfo.isReduceMotionEnabled(),
      ),
    ]);

    let accessibilityServiceEnabled = false;
    let reduceTransparencyEnabled = false;
    let highTextContrastEnabled = false;
    let darkerSystemColorsEnabled = false;
    let boldTextEnabled = false;
    let invertColorsEnabled = false;
    let grayscaleEnabled = false;
    let prefersCrossFadeTransitions = false;

    if (Platform.OS === 'android') {
      [
        accessibilityServiceEnabled,
        highTextContrastEnabled,
      ] = await Promise.all([
        safeBoolean(() =>
          AccessibilityInfo.isAccessibilityServiceEnabled(),
        ),
        safeBoolean(() =>
          AccessibilityInfo.isHighTextContrastEnabled(),
        ),
      ]);
    }

    if (Platform.OS === 'ios') {
      [
        reduceTransparencyEnabled,
        darkerSystemColorsEnabled,
        boldTextEnabled,
        invertColorsEnabled,
        grayscaleEnabled,
        prefersCrossFadeTransitions,
      ] = await Promise.all([
        safeBoolean(() =>
          AccessibilityInfo.isReduceTransparencyEnabled(),
        ),
        safeBoolean(() =>
          AccessibilityInfo.isDarkerSystemColorsEnabled(),
        ),
        safeBoolean(() =>
          AccessibilityInfo.isBoldTextEnabled(),
        ),
        safeBoolean(() =>
          AccessibilityInfo.isInvertColorsEnabled(),
        ),
        safeBoolean(() =>
          AccessibilityInfo.isGrayscaleEnabled(),
        ),
        safeBoolean(() =>
          AccessibilityInfo.prefersCrossFadeTransitions(),
        ),
      ]);
    }

    return {
      ready: true,
      screenReaderEnabled,
      accessibilityServiceEnabled,
      reduceMotionEnabled,
      reduceTransparencyEnabled,
      highTextContrastEnabled,
      darkerSystemColorsEnabled,
      prefersIncreasedContrast:
        highTextContrastEnabled ||
        darkerSystemColorsEnabled,
      boldTextEnabled,
      invertColorsEnabled,
      grayscaleEnabled,
      prefersCrossFadeTransitions,
    };
  };

const refresh = async (): Promise<void> => {
  const next = await readPlatformSnapshot();
  commit(next);
};

/**
 * Register each event using its literal event name.
 *
 * Do not derive the event-name type from AccessibilityInfo.addEventListener:
 * its specialized/overloaded declaration can cause TypeScript to select only
 * the `announcementFinished` overload.
 */
const installNativeSubscriptions = (): void => {
  addSubscription(
    AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (screenReaderEnabled) => {
        commit({ screenReaderEnabled });
      },
    ),
  );

  addSubscription(
    AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (reduceMotionEnabled) => {
        commit({ reduceMotionEnabled });
      },
    ),
  );

  if (Platform.OS === 'android') {
    /**
     * React Native 0.86.2 exposes
     * `isAccessibilityServiceEnabled()` as a query, but its public
     * `AccessibilityChangeEventName` does NOT include
     * `accessibilityServiceChanged`.
     *
     * Do not force/cast an unsupported event into the type system.
     * `accessibilityServiceEnabled` is reconciled by `refresh()` at startup
     * and whenever the app becomes active.
     */
    addSubscription(
      AccessibilityInfo.addEventListener(
        'highTextContrastChanged',
        (highTextContrastEnabled) => {
          commit({ highTextContrastEnabled });
        },
      ),
    );
  }

  if (Platform.OS === 'ios') {
    addSubscription(
      AccessibilityInfo.addEventListener(
        'reduceTransparencyChanged',
        (reduceTransparencyEnabled) => {
          commit({ reduceTransparencyEnabled });
        },
      ),
    );

    addSubscription(
      AccessibilityInfo.addEventListener(
        'darkerSystemColorsChanged',
        (darkerSystemColorsEnabled) => {
          commit({ darkerSystemColorsEnabled });
        },
      ),
    );

    addSubscription(
      AccessibilityInfo.addEventListener(
        'boldTextChanged',
        (boldTextEnabled) => {
          commit({ boldTextEnabled });
        },
      ),
    );

    addSubscription(
      AccessibilityInfo.addEventListener(
        'invertColorsChanged',
        (invertColorsEnabled) => {
          commit({ invertColorsEnabled });
        },
      ),
    );

    addSubscription(
      AccessibilityInfo.addEventListener(
        'grayscaleChanged',
        (grayscaleEnabled) => {
          commit({ grayscaleEnabled });
        },
      ),
    );
  }
};

/**
 * `prefersCrossFadeTransitions()` does not currently expose a dedicated
 * public change event. Foreground refresh also reconciles Settings changes.
 */
const handleAppStateChange = (
  nextState: AppStateStatus,
): void => {
  if (nextState === 'active') {
    void refresh();
  }
};

const start = (): void => {
  if (started) {
    return;
  }

  started = true;
  installNativeSubscriptions();

  addSubscription(
    AppState.addEventListener(
      'change',
      handleAppStateChange,
    ),
  );

  void refresh();
};

const stop = (): void => {
  nativeSubscriptions
    .splice(0)
    .forEach((subscription) => {
      subscription.remove();
    });

  started = false;
};

export const accessibilityPreferences = {
  start,
  stop,
  refresh,

  getSnapshot(): AccessibilitySnapshot {
    return snapshot;
  },

  getServerSnapshot(): AccessibilitySnapshot {
    return initialSnapshot;
  },

  subscribe(listener: Listener): () => void {
    start();
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
} as const;
