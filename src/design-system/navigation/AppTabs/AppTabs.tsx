import {
  ScrollView,
} from 'react-native';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  AppBadge,
} from '../../data-display';
import {
  appHaptics,
} from '../../haptics';
import {
  useControllableState,
} from '../../hooks';
import {
  AppInline,
} from '../../layout';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';

import type {
  AppTabsProps,
  AppTabsVariant,
} from './AppTabs.types';

export const AppTabs = <
  TValue extends string,
>({
  options,
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  scrollable = true,
  style,
  testID,
}: AppTabsProps<TValue>) => {
  const resolvedDefaultValue:
    TValue =
      defaultValue ??
      value ??
      options[0].value;

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

  const tabs = (
    <AppInline
      gap={
        variant === 'pill'
          ? 'xs'
          : 'none'
      }
      align="stretch"
      style={[
        styles.row(
          variant,
        ),
        style,
      ]}
      accessibilityRole="tablist"
      testID={testID}
    >
      {options.map(
        (option) => {
          const selected =
            option.value ===
            selectedValue;

          return (
            <AppPressable
              key={
                option.value
              }
              accessibilityRole="tab"
              accessibilityLabel={
                option
                  .accessibilityLabel ??
                option.label
              }
              accessibilityState={{
                selected,
                disabled:
                  option.disabled,
              }}
              disabled={
                option.disabled
              }
              interaction="subtle"
              haptic={false}
              radius={
                variant ===
                  'pill'
                  ? 'full'
                  : 'none'
              }
              touchTarget="minimum"
              stateLayerColorToken="primaryStrong"
              onPress={() => {
                if (selected) {
                  return;
                }

                setSelectedValue(
                  option.value,
                );

                void appHaptics.selection();
              }}
              style={
                styles.tab(
                  variant,
                  selected,
                  scrollable,
                )
              }
            >
              <AppInline
                gap="sm"
                align="center"
                justify="center"
              >
                {option.icon ? (
                  <AppIcon
                    icon={
                      option.icon
                    }
                    size="sm"
                    colorToken={
                      selected
                        ? 'primaryStrong'
                        : 'textSecondary'
                    }
                    decorative
                  />
                ) : null}

                <AppText
                  variant="labelLarge"
                  colorToken={
                    selected
                      ? 'primaryStrong'
                      : option.disabled
                        ? 'textDisabled'
                        : 'textSecondary'
                  }
                  weight={
                    selected
                      ? 'semibold'
                      : 'medium'
                  }
                  numberOfLines={1}
                >
                  {
                    option.label
                  }
                </AppText>

                {option.badge !==
                undefined ? (
                  <AppBadge
                    size="sm"
                    variant="soft"
                    tone={
                      selected
                        ? 'primary'
                        : 'neutral'
                    }
                  >
                    {
                      option.badge
                    }
                  </AppBadge>
                ) : null}
              </AppInline>
            </AppPressable>
          );
        },
      )}
    </AppInline>
  );

  if (!scrollable) {
    return tabs;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={
        false
      }
      contentContainerStyle={
        styles.scrollContent
      }
    >
      {tabs}
    </ScrollView>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    row: (
      variant:
        AppTabsVariant,
    ) => ({
      minWidth: '100%',
      borderBottomWidth:
        variant ===
          'underline'
          ? StyleSheet
              .hairlineWidth
          : 0,
      borderBottomColor:
        theme.colors.divider,
    }),

    tab: (
      variant:
        AppTabsVariant,
      selected: boolean,
      scrollable: boolean,
    ) => ({
      minHeight:
        theme.sizes.control.md,
      flex:
        scrollable
          ? undefined
          : 1,
      paddingHorizontal:
        theme.spacing.lg,
      justifyContent: 'center',
      borderBottomWidth:
        variant ===
          'underline' &&
        selected
          ? 2
          : 0,
      borderBottomColor:
        theme.colors
          .primaryStrong,
      backgroundColor:
        variant === 'pill' &&
        selected
          ? theme.colors
              .primaryContainer
          : 'transparent',
    }),

    scrollContent: {
      flexGrow: 1,
    },
  }),
);
