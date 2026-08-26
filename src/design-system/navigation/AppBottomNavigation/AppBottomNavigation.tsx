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
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';

import type {
  AppBottomNavigationProps,
} from './AppBottomNavigation.types';

const DEFAULT_EDGES = [
  'left',
  'right',
  'bottom',
] as const;

export const AppBottomNavigation = <
  TValue extends string,
>({
  items,
  value,
  defaultValue,
  onValueChange,
  showLabels = true,
  safeAreaEdges = [
    ...DEFAULT_EDGES,
  ],
  style,
  testID,
}: AppBottomNavigationProps<TValue>) => {
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
        styles.safeArea,
        style,
      ]}
      testID={testID}
    >
      <View
        style={styles.row}
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
                    accessible={false}
                  >
                    {item.label}
                  </AppText>
                ) : null}
              </AppPressable>
            );
          },
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    safeArea: {
      width: '100%',
      backgroundColor:
        theme.colors.surface,
      borderTopWidth:
        StyleSheet.hairlineWidth,
      borderTopColor:
        theme.colors.divider,
      zIndex:
        theme.zIndex.sticky,
    },

    row: {
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'stretch',
      paddingHorizontal:
        theme.spacing.sm,
      paddingTop:
        theme.spacing.xs,
    },

    item: {
      minWidth: 0,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xxs,
      paddingHorizontal:
        theme.spacing.xs,
      paddingVertical:
        theme.spacing.xs,
    },

    iconWrap: (
      selected: boolean,
    ) => ({
      minWidth: 56,
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
  }),
);
