import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type {
  ComponentTone,
} from '../../contracts';
import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  AppIcon,
  AppSurface,
  AppText,
} from '../../primitives';
import {
  resolveToneContainerColor,
} from '../../utils';

import type {
  AppStatProps,
} from './AppStat.types';

const resolveIconContentToken = (
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

export const AppStat = ({
  label,
  value,
  description,
  supporting,
  icon,
  tone = 'neutral',
  variant = 'plain',
  style,
  testID,
}: AppStatProps) => {
  const content = (
    <AppStack gap="md">
      <AppInline
        gap="md"
        align="center"
      >
        {icon ? (
          <View
            style={styles.icon(
              tone,
            )}
          >
            <AppIcon
              icon={icon}
              size="md"
              colorToken={
                resolveIconContentToken(
                  tone,
                )
              }
              decorative
            />
          </View>
        ) : null}

        <View
          style={styles.label}
        >
          {typeof label ===
            'string' ||
          typeof label ===
            'number' ? (
            <AppText
              variant="bodySmall"
              tone="secondary"
              weight="medium"
            >
              {label}
            </AppText>
          ) : (
            label
          )}
        </View>
      </AppInline>

      <AppStack gap="xs">
        {typeof value ===
          'string' ||
        typeof value ===
          'number' ? (
          <AppText
            variant="headlineSmall"
            weight="bold"
          >
            {value}
          </AppText>
        ) : (
          value
        )}

        {description ? (
          typeof description ===
            'string' ||
          typeof description ===
            'number' ? (
            <AppText
              variant="bodySmall"
              tone="secondary"
            >
              {description}
            </AppText>
          ) : (
            description
          )
        ) : null}
      </AppStack>

      {supporting ? (
        <View>
          {supporting}
        </View>
      ) : null}
    </AppStack>
  );

  if (variant === 'plain') {
    return (
      <View
        style={style}
        testID={testID}
      >
        {content}
      </View>
    );
  }

  return (
    <AppSurface
      variant={
        variant === 'tonal'
          ? 'tonal'
          : 'outlined'
      }
      tone={tone}
      radius="lg"
      padding="lg"
      style={style}
      testID={testID}
    >
      {content}
    </AppSurface>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    icon: (
      tone: ComponentTone,
    ) => ({
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:
        theme.radius.md,
      backgroundColor:
        resolveToneContainerColor(
          theme,
          tone,
        ),
    }),

    label: {
      minWidth: 0,
      flex: 1,
    },
  }),
);
