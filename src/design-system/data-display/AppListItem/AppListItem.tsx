import { View } from 'react-native';
import {
  ChevronRight,
} from 'lucide-react-native';
import { StyleSheet } from 'react-native-unistyles';

import type {
  ComponentSize,
} from '../../contracts';
import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';

import type {
  AppListItemProps,
} from './AppListItem.types';

const minimumHeight = {
  sm: 52,
  md: 64,
  lg: 76,
} as const;

export const AppListItem = ({
  title,
  description,
  metadata,
  leading,
  trailing,
  disclosure = false,
  size = 'md',
  selected = false,
  disabled = false,
  onPress,
  onLongPress,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
  style,
  contentStyle,
  testID,
}: AppListItemProps) => {
  const interactive =
    Boolean(onPress || onLongPress);

  const resolvedLabel =
    accessibilityLabel ??
    (typeof title === 'string' ||
    typeof title === 'number'
      ? String(title)
      : undefined);

  const content = (
    <AppInline
      gap="md"
      align="center"
      style={[
        styles.content(size),
        contentStyle,
      ]}
    >
      {leading ? (
        <View
          style={styles.leading}
        >
          {leading}
        </View>
      ) : null}

      <AppStack
        gap="xxs"
        flex
        style={styles.textContent}
      >
        <AppInline
          gap="sm"
          align="baseline"
          justify="space-between"
        >
          <View
            style={styles.title}
          >
            {typeof title ===
              'string' ||
            typeof title ===
              'number' ? (
              <AppText
                variant={
                  size === 'sm'
                    ? 'bodyMedium'
                    : 'bodyLarge'
                }
                weight="medium"
                tone={
                  disabled
                    ? 'disabled'
                    : 'default'
                }
                numberOfLines={1}
              >
                {title}
              </AppText>
            ) : (
              title
            )}
          </View>

          {metadata ? (
            <View>
              {typeof metadata ===
                'string' ||
              typeof metadata ===
                'number' ? (
                <AppText
                  variant="caption"
                  tone={
                    disabled
                      ? 'disabled'
                      : 'muted'
                  }
                  numberOfLines={1}
                >
                  {metadata}
                </AppText>
              ) : (
                metadata
              )}
            </View>
          ) : null}
        </AppInline>

        {description ? (
          typeof description ===
            'string' ||
          typeof description ===
            'number' ? (
            <AppText
              variant={
                size === 'lg'
                  ? 'bodyMedium'
                  : 'bodySmall'
              }
              tone={
                disabled
                  ? 'disabled'
                  : 'secondary'
              }
              numberOfLines={
                size === 'lg'
                  ? 2
                  : 1
              }
            >
              {description}
            </AppText>
          ) : (
            description
          )
        ) : null}
      </AppStack>

      {trailing ? (
        <View
          style={styles.trailing}
        >
          {trailing}
        </View>
      ) : disclosure ? (
        <AppIcon
          icon={ChevronRight}
          size="md"
          tone={
            disabled
              ? 'disabled'
              : 'muted'
          }
          decorative
        />
      ) : null}
    </AppInline>
  );

  if (!interactive) {
    return (
      <View
        style={[
          styles.item(
            size,
            selected,
          ),
          style,
        ]}
        testID={testID}
      >
        {content}
      </View>
    );
  }

  return (
    <AppPressable
      accessibilityRole={
        accessibilityRole ??
        'button'
      }
      accessibilityLabel={
        resolvedLabel
      }
      accessibilityHint={
        accessibilityHint
      }
      accessibilityState={{
        selected,
        disabled,
      }}
      disabled={disabled}
      interaction="subtle"
      radius="md"
      stateLayerColorToken={
        selected
          ? 'primaryStrong'
          : 'text'
      }
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.item(
          size,
          selected,
        ),
        style,
      ]}
      testID={testID}
    >
      {content}
    </AppPressable>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    item: (
      size: ComponentSize,
      selected: boolean,
    ) => ({
      minHeight:
        minimumHeight[size],
      alignSelf: 'stretch',
      justifyContent: 'center',
      borderRadius:
        theme.radius.md,
      backgroundColor:
        selected
          ? theme.colors
              .primaryContainer
          : 'transparent',
    }),

    content: (
      size: ComponentSize,
    ) => ({
      minHeight:
        minimumHeight[size],
      paddingHorizontal:
        size === 'sm'
          ? theme.spacing.md
          : theme.spacing.lg,
      paddingVertical:
        size === 'lg'
          ? theme.spacing.md
          : theme.spacing.sm,
    }),

    leading: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    textContent: {
      minWidth: 0,
    },

    title: {
      flex: 1,
      minWidth: 0,
    },

    trailing: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
