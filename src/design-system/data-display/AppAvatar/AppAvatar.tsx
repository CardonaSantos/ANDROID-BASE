import { View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  requireAccessibilityLabel,
} from '../../accessibility';
import type {
  ComponentTone,
} from '../../contracts';
import {
  AppIcon,
  AppImage,
  AppText,
} from '../../primitives';
import {
  sizes,
} from '../../tokens';
import {
  resolveToneContainerColor,
} from '../../utils';

import type {
  AppAvatarProps,
  AppAvatarShape,
  AppAvatarSize,
} from './AppAvatar.types';

const initialsFromName = (
  name?: string,
): string => {
  const normalized =
    name?.trim();

  if (!normalized) {
    return '';
  }

  const parts =
    normalized
      .split(/\s+/)
      .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
};

export const AppAvatar = ({
  source,
  placeholder,
  name,
  fallback,
  size = 'md',
  shape = 'circle',
  tone = 'neutral',
  contentFit = 'cover',
  cachePolicy = 'memory-disk',
  decorative = true,
  accessibilityLabel,
  style,
  testID,
}: AppAvatarProps) => {
  const physicalSize =
    sizes.avatar[size];

  const label =
    decorative
      ? undefined
      : requireAccessibilityLabel(
          accessibilityLabel ??
            name,
          'AppAvatar',
        );

  const initials =
    initialsFromName(name);

  return (
    <View
      accessible={
        !decorative &&
        Boolean(label)
      }
      accessibilityRole={
        !decorative &&
        label
          ? 'image'
          : undefined
      }
      accessibilityLabel={label}
      testID={testID}
      style={[
        styles.avatar(
          size,
          shape,
          tone,
        ),
        style,
      ]}
    >
      {source ? (
        <AppImage
          source={source}
          placeholder={placeholder}
          contentFit={contentFit}
          cachePolicy={cachePolicy}
          decorative
          radius={
            shape === 'circle'
              ? 'full'
              : 'md'
          }
          style={{
            width:
              physicalSize,
            height:
              physicalSize,
          }}
        />
      ) : fallback ? (
        fallback
      ) : initials ? (
        <AppText
          variant={
            size === 'sm'
              ? 'labelMedium'
              : size === 'md'
                ? 'labelLarge'
                : size === 'lg'
                  ? 'titleSmall'
                  : 'titleMedium'
          }
          colorToken={
            resolveAvatarContentToken(
              tone,
            )
          }
          weight="semibold"
          accessible={false}
        >
          {initials}
        </AppText>
      ) : (
        <AppIcon
          icon={UserRound}
          size={
            size === 'sm'
              ? 'sm'
              : size === 'md'
                ? 'md'
                : size === 'lg'
                  ? 'lg'
                  : 'xl'
          }
          colorToken={
            resolveAvatarContentToken(
              tone,
            )
          }
          decorative
        />
      )}
    </View>
  );
};

const resolveAvatarContentToken = (
  tone: ComponentTone,
):
  | 'text'
  | 'onPrimaryContainer'
  | 'onSuccessContainer'
  | 'onWarningContainer'
  | 'onDangerContainer'
  | 'onInfoContainer' => {
  switch (tone) {
    case 'primary':
      return 'onPrimaryContainer';

    case 'success':
      return 'onSuccessContainer';

    case 'warning':
      return 'onWarningContainer';

    case 'danger':
      return 'onDangerContainer';

    case 'info':
      return 'onInfoContainer';

    case 'neutral':
    default:
      return 'text';
  }
};

const styles = StyleSheet.create(
  (theme) => ({
    avatar: (
      size: AppAvatarSize,
      shape: AppAvatarShape,
      tone: ComponentTone,
    ) => ({
      width:
        theme.sizes.avatar[size],
      height:
        theme.sizes.avatar[size],
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius:
        shape === 'circle'
          ? theme.radius.full
          : theme.radius.md,
      backgroundColor:
        resolveToneContainerColor(
          theme,
          tone,
        ),
    }),
  }),
);
