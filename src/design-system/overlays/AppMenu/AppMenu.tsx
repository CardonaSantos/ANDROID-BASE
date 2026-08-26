import {
  Check,
} from 'lucide-react-native';
import {
  Menu,
} from 'react-native-paper';
import {
  StyleSheet,
} from 'react-native-unistyles';

import type {
  ContentTone,
  SemanticColorToken,
} from '../../contracts';
import {
  appHaptics,
} from '../../haptics';
import {
  useControllableState,
} from '../../hooks';
import {
  AppDivider,
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';
import {
  AppInline,
  AppStack,
} from '../../layout';

import {
  overlayCopy,
} from '../overlay.copy';

import type {
  AppMenuProps,
} from './AppMenu.types';

export const AppMenu = ({
  open,
  defaultOpen = false,
  onOpenChange,
  anchor,
  items,
  anchorPosition = 'bottom',
  overlayAccessibilityLabel =
    overlayCopy.menu.close,
  contentStyle,
  testID,
}: AppMenuProps) => {
  const controlled =
    open !== undefined;

  const [
    isOpen,
    setOpen,
  ] =
    useControllableState<boolean>(
      controlled
        ? {
            value:
              open ?? false,
            defaultValue:
              defaultOpen,
            onValueChange:
              onOpenChange,
          }
        : {
            defaultValue:
              defaultOpen,
            onValueChange:
              onOpenChange,
          },
    );

  const controls = {
    isOpen,

    open() {
      setOpen(true);
    },

    close() {
      setOpen(false);
    },

    toggle() {
      setOpen(
        (current) =>
          !current,
      );
    },
  };

  return (
    <Menu
      visible={isOpen}
      onDismiss={
        controls.close
      }
      anchor={
        anchor(controls)
      }
      anchorPosition={
        anchorPosition
      }
      overlayAccessibilityLabel={
        overlayAccessibilityLabel
      }
      keyboardShouldPersistTaps="handled"
      contentStyle={[
        styles.menu,
        contentStyle,
      ]}
      testID={testID}
    >
      {items.map(
        (item) => {
          if (
            item.type ===
            'separator'
          ) {
            return (
              <AppDivider
                key={item.id}
              />
            );
          }

          return (
            <AppPressable
              key={item.id}
              accessibilityRole="menuitem"
              accessibilityLabel={
                item.label
              }
              accessibilityState={{
                selected:
                  item.selected,
                disabled:
                  item.disabled,
              }}
              disabled={
                item.disabled
              }
              interaction="subtle"
              haptic={false}
              radius="sm"
              touchTarget="minimum"
              stateLayerColorToken={
                resolveMenuStateLayer(
                  item.tone,
                )
              }
              onPress={() => {
                item.onPress();

                void appHaptics.selection();

                if (
                  item.closeOnPress !==
                  false
                ) {
                  controls.close();
                }
              }}
              style={
                styles.item
              }
            >
              <AppInline
                gap="md"
                align="center"
              >
                <AppInline
                  gap="sm"
                  align="center"
                  flex
                >
                  {item.icon ? (
                    <AppIcon
                      icon={
                        item.icon
                      }
                      size="md"
                      tone={
                        item.disabled
                          ? 'disabled'
                          : resolveMenuContentTone(
                              item.tone,
                              true,
                            )
                      }
                      decorative
                    />
                  ) : null}

                  <AppStack
                    gap="xxs"
                    flex
                  >
                    <AppText
                      variant="bodyMedium"
                      tone={
                        item.disabled
                          ? 'disabled'
                          : resolveMenuContentTone(
                              item.tone,
                              false,
                            )
                      }
                    >
                      {item.label}
                    </AppText>

                    {item.description ? (
                      <AppText
                        variant="caption"
                        tone={
                          item.disabled
                            ? 'disabled'
                            : 'secondary'
                        }
                      >
                        {
                          item.description
                        }
                      </AppText>
                    ) : null}
                  </AppStack>
                </AppInline>

                {item.selected ? (
                  <AppIcon
                    icon={Check}
                    size="sm"
                    tone="primary"
                    decorative
                  />
                ) : null}
              </AppInline>
            </AppPressable>
          );
        },
      )}
    </Menu>
  );
};


const resolveMenuContentTone = (
  tone:
    | 'neutral'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | undefined,
  secondaryWhenNeutral: boolean,
): ContentTone => {
  if (
    !tone ||
    tone === 'neutral'
  ) {
    return secondaryWhenNeutral
      ? 'secondary'
      : 'default';
  }

  return tone;
};

const resolveMenuStateLayer = (
  tone:
    | 'neutral'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | undefined,
): SemanticColorToken => {
  switch (tone) {
    case 'primary':
      return 'primaryStrong';

    case 'success':
      return 'success';

    case 'warning':
      return 'onWarningContainer';

    case 'danger':
      return 'danger';

    case 'info':
      return 'info';

    case 'neutral':
    default:
      return 'text';
  }
};

const styles = StyleSheet.create(
  (theme) => ({
    menu: {
      minWidth: 220,
      maxWidth: 360,
      paddingVertical:
        theme.spacing.xs,
      borderRadius:
        theme.radius.md,
      backgroundColor:
        theme.colors
          .surfaceElevated,
    },

    item: {
      minWidth: 0,
      paddingHorizontal:
        theme.spacing.md,
      paddingVertical:
        theme.spacing.sm,
    },
  }),
);
