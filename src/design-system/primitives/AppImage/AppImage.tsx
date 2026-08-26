import {
  forwardRef,
  useEffect,
  useState,
  type ComponentRef,
} from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { ImageOff } from 'lucide-react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  requireAccessibilityLabel,
  useAccessibilityPreferences,
} from '../../accessibility';
import {
  motion,
  type RadiusToken,
} from '../../tokens';
import { AppIcon } from '../AppIcon';

import type {
  AppImageProps,
} from './AppImage.types';

export const AppImage = forwardRef<
  ComponentRef<typeof Image>,
  AppImageProps
>(
  (
    {
      style,
      imageStyle,
      radius = 'md',
      aspectRatio,
      decorative = false,
      accessibilityLabel,
      fallback,
      transition,
      contentFit = 'cover',
      placeholderContentFit,
      cachePolicy = 'memory-disk',
      source,
      onError,
      ...rest
    },
    ref,
  ) => {
    const [hasError, setHasError] =
      useState(false);

    const {
      reduceMotionEnabled,
    } =
      useAccessibilityPreferences();

    useEffect(() => {
      setHasError(false);
    }, [source]);

    const label = decorative
      ? undefined
      : requireAccessibilityLabel(
          accessibilityLabel,
          'AppImage',
        );

    const resolvedTransition =
      reduceMotionEnabled
        ? 0
        : transition ??
          motion.duration.fast;

    return (
      <View
        style={[
          styles.container(radius),
          aspectRatio
            ? { aspectRatio }
            : undefined,
          style,
        ]}
        accessible={false}
      >
        {!hasError ? (
          <Image
            ref={ref}
            source={source}
            contentFit={contentFit}
            placeholderContentFit={
              placeholderContentFit ??
              contentFit
            }
            cachePolicy={cachePolicy}
            transition={
              resolvedTransition
            }
            accessible={
              !decorative &&
              Boolean(label)
            }
            accessibilityLabel={label}
            alt={
              decorative
                ? ''
                : label
            }
            style={[
              styles.image,
              imageStyle,
            ]}
            onError={(event) => {
              setHasError(true);
              onError?.(event);
            }}
            {...rest}
          />
        ) : (
          <View
            style={styles.fallback}
            accessible={
              !decorative &&
              Boolean(label)
            }
            accessibilityRole={
              decorative
                ? undefined
                : 'image'
            }
            accessibilityLabel={
              label
            }
          >
            {fallback ?? (
              <AppIcon
                icon={ImageOff}
                size="lg"
                tone="muted"
                decorative
              />
            )}
          </View>
        )}
      </View>
    );
  },
);

AppImage.displayName = 'AppImage';

const styles = StyleSheet.create(
  (theme) => ({
    container: (
      radius: RadiusToken,
    ) => ({
      position: 'relative',
      overflow: 'hidden',
      backgroundColor:
        theme.colors
          .surfaceSecondary,
      borderRadius:
        theme.radius[radius],
    }),

    image: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },

    fallback: {
      flex: 1,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        theme.colors
          .surfaceSecondary,
    },
  }),
);
