import {
  View,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  appHaptics,
} from '../../haptics';
import {
  useControllableState,
} from '../../hooks';
import {
  AppStack,
} from '../../layout';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';

import type {
  AppNavigationRailProps,
} from './AppNavigationRail.types';

const DEFAULT_EDGES = [
  'top',
  'bottom',
  'left',
] as const;

export const AppNavigationRail = <
  TValue extends string,
>({
  items,
  value,
  defaultValue,
  onValueChange,
  header,
  footer,
  showLabels = true,
  safeAreaEdges = [
    ...DEFAULT_EDGES,
  ],
  style,
  testID,
}: AppNavigationRailProps<TValue>) => {
  const resolvedDefaultValue:
    TValue =
      defaultValue ??
      value ??
      items[0].value;

  const controlled =
    value !== undefined;

  const [
    selectedValue,
    setSelectedValue,
  ] =
    useControllableState<TValue>(
      controlled
        ? {
            value:
              value ??
              resolvedDefaultValue,
            defaultValue:
              resolvedDefaultValue,
            onValueChange,
          }
        : {
            defaultValue:
              resolvedDefaultValue,
            onValueChange,
          },
    );

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      accessibilityRole="tablist"
      style={[
        styles.safeArea(
          showLabels,
        ),
        style,
      ]}
      testID={testID}
    >
      {header ? (
        <View
          style={
            styles.slot
          }
        >
          {header}
        </View>
      ) : null}

      <AppStack
        gap="xs"
        align="stretch"
        style={styles.items}
      >
        {items.map(
          (item) => {
            const selected =
              item.value ===
              selectedValue;

            const Icon =
              selected &&
              item.selectedIcon
                ? item.selectedIcon
                : item.icon;

            return (
              <AppPressable
                key={item.value}
                accessibilityRole="tab"
                accessibilityLabel={
                  item
                    .accessibilityLabel ??
                  item.label
                }
                accessibilityState={{
                  selected,
                  disabled:
                    item.disabled,
                }}
                disabled={
                  item.disabled
                }
                interaction="subtle"
                haptic={false}
                radius="lg"
                touchTarget="minimum"
                stateLayerColorToken="primaryStrong"
                onPress={() => {
                  if (
                    selected
                  ) {
                    return;
                  }

                  setSelectedValue(
                    item.value,
                  );

                  void appHaptics.selection();
                }}
                style={
                  styles.item
                }
              >
                <View
                  style={
                    styles.iconWrap(
                      selected,
                    )
                  }
                >
                  <AppIcon
                    icon={Icon}
                    size="lg"
                    colorToken={
                      selected
                        ? 'onPrimaryContainer'
                        : item.disabled
                          ? 'textDisabled'
                          : 'textSecondary'
                    }
                    decorative
                  />

                  {item.badge !== undefined &&
                  item.badge !== null ? (
                    <View
                      style={
                        styles.badge
                      }
                    >
                      {
                        item.badge
                      }
                    </View>
                  ) : null}
                </View>

                {showLabels ? (
                  <AppText
                    variant="labelSmall"
                    colorToken={
                      selected
                        ? 'primaryStrong'
                        : item.disabled
                          ? 'textDisabled'
                          : 'textSecondary'
                    }
                    weight={
                      selected
                        ? 'semibold'
                        : 'medium'
                    }
                    numberOfLines={1}
                    align="center"
                    accessible={false}
                  >
                    {item.label}
                  </AppText>
                ) : null}
              </AppPressable>
            );
          },
        )}
      </AppStack>

      <View
        style={styles.spacer}
      />

      {footer ? (
        <View
          style={
            styles.slot
          }
        >
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    safeArea: (
      showLabels: boolean,
    ) => ({
      width:
        showLabels
          ? 96
          : 72,
      alignSelf: 'stretch',
      backgroundColor:
        theme.colors.surface,
      borderRightWidth:
        StyleSheet.hairlineWidth,
      borderRightColor:
        theme.colors.divider,
      zIndex:
        theme.zIndex.sticky,
    }),

    slot: {
      alignItems: 'center',
      padding:
        theme.spacing.sm,
    },

    items: {
      paddingHorizontal:
        theme.spacing.sm,
      paddingVertical:
        theme.spacing.sm,
    },

    item: {
      minHeight: 64,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xxs,
      paddingVertical:
        theme.spacing.xs,
    },

    iconWrap: (
      selected: boolean,
    ) => ({
      width: 56,
      height: 32,
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:
        theme.radius.full,
      backgroundColor:
        selected
          ? theme.colors
              .primaryContainer
          : 'transparent',
    }),

    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
    },

    spacer: {
      flex: 1,
    },
  }),
);
