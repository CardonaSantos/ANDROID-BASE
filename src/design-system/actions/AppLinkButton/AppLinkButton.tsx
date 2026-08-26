import { Link } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';

import {
  resolveAccessibilityLabel,
} from '../../accessibility';
import type {
  ComponentSize,
} from '../../contracts';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';
import { resolveActionColorTokens } from '../action-colors';

import type {
  AppLinkButtonProps,
} from './AppLinkButton.types';

const textVariantBySize = {
  sm: 'labelMedium',
  md: 'labelLarge',
  lg: 'labelLarge',
} as const;

const iconSizeByControlSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

export const AppLinkButton = ({
  href,
  replace = false,
  children,
  tone = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  accessibilityLabel,
  interaction = 'subtle',
  style,
  ...rest
}: AppLinkButtonProps) => {
  const colors =
    resolveActionColorTokens(
      'ghost',
      tone,
      false,
    );

  const derivedLabel =
    typeof children === 'string' ||
    typeof children === 'number'
      ? String(children)
      : undefined;

  const label =
    resolveAccessibilityLabel({
      explicit:
        accessibilityLabel,
      fallback: derivedLabel,
    });

  return (
    <Link
      href={href}
      replace={replace}
      asChild
    >
      <AppPressable
        accessibilityRole="link"
        accessibilityLabel={label}
        interaction={interaction}
        radius="sm"
        stateLayerColorToken={
          colors.stateLayer
        }
        touchTarget="compact"
        style={[
          styles.link(size),
          style,
        ]}
        {...rest}
      >
        {leadingIcon ? (
          <AppIcon
            icon={leadingIcon}
            size={
              iconSizeByControlSize[
                size
              ]
            }
            colorToken={
              colors.content
            }
            decorative
          />
        ) : null}

        {typeof children ===
          'string' ||
        typeof children ===
          'number' ? (
          <AppText
            variant={
              textVariantBySize[size]
            }
            colorToken={
              colors.content
            }
          >
            {children}
          </AppText>
        ) : (
          children
        )}

        {trailingIcon ? (
          <AppIcon
            icon={trailingIcon}
            size={
              iconSizeByControlSize[
                size
              ]
            }
            colorToken={
              colors.content
            }
            decorative
          />
        ) : null}
      </AppPressable>
    </Link>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    link: (
      size: ComponentSize,
    ) => ({
      minHeight:
        theme.sizes.control[size],
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal:
        theme.spacing.sm,
      borderRadius:
        theme.radius.sm,
    }),
  }),
);
