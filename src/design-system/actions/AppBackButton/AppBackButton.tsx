import { useCallback } from 'react';
import {
  router,
} from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { AppIconButton } from '../AppIconButton';

import type {
  AppBackButtonProps,
} from './AppBackButton.types';

/**
 * Stable NOVA back control.
 *
 * Uses Expo Router's current imperative API instead of experimental stack
 * back-button components, keeping the visual implementation under our design
 * system while hardware/system back remains owned by the navigator.
 */
export const AppBackButton = ({
  accessibilityLabel = 'Volver',
  fallbackHref,
  fallbackMode = 'replace',
  onBack,
  haptic = 'selection',
  variant = 'ghost',
  tone = 'neutral',
  ...rest
}: AppBackButtonProps) => {
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    if (!fallbackHref) {
      return;
    }

    if (
      fallbackMode === 'push'
    ) {
      router.push(fallbackHref);
    } else {
      router.replace(
        fallbackHref,
      );
    }
  }, [
    fallbackHref,
    fallbackMode,
    onBack,
  ]);

  return (
    <AppIconButton
      icon={ArrowLeft}
      accessibilityLabel={
        accessibilityLabel
      }
      haptic={haptic}
      variant={variant}
      tone={tone}
      onPress={handleBack}
      {...rest}
    />
  );
};
