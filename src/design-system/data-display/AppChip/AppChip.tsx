import {
  View,
  type GestureResponderEvent,
} from 'react-native';
import {
  Check,
  X,
} from 'lucide-react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  AppIconButton,
} from '../../actions';
import {
  resolveActionColorTokens,
} from '../../actions/action-colors';
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
import {
  AppInline,
} from '../../layout';

import type {
  AppChipProps,
  AppChipSize,
  AppChipVariant,
} from './AppChip.types';

const chipCopy = {
  dismiss: 'Quitar',
} as const;

export const AppChip = ({
  children,
  leadingIcon,
  tone = 'neutral',
  variant = 'outlined',
  size = 'md',
  selected,
  defaultSelected = false,
  onSelectedChange,
  onPress,
  onDismiss,
  disabled = false,
  accessibilityLabel,
  dismissAccessibilityLabel,
  style,
  testID,
}: AppChipProps) => {
  const selectable =
    selected !== undefined ||
    Boolean(onSelectedChange);

  const controlled =
    selected !== undefined;

  const [
    isSelected,
    setSelected,
  ] =
    useControllableState<boolean>(
      controlled
        ? {
            value:
              selected ?? false,
            defaultValue:
              defaultSelected,
            onValueChange:
              onSelectedChange,
          }
        : {
            defaultValue:
              defaultSelected,
            onValueChange:
              onSelectedChange,
          },
    );

  const effectiveVariant:
    AppChipVariant =
      isSelected &&
      variant === 'outlined'
        ? 'soft'
        : variant;

  const colors =
    resolveActionColorTokens(
      effectiveVariant,
      tone,
      disabled,
    );

  const textLabel =
    typeof children === 'string' ||
    typeof children === 'number'
      ? String(children)
      : undefined;

  const resolvedLabel =
    accessibilityLabel ??
    textLabel;

  const mainInteractive =
    selectable ||
    Boolean(onPress);

  const handleMainPress = (
    event: GestureResponderEvent,
  ) => {
    if (selectable) {
      const next =
        !isSelected;

      setSelected(next);
      void appHaptics.selection();
    }

    onPress?.(event);
  };

  const mainContent = (
    <AppInline
      gap="sm"
      align="center"
    >
      {isSelected ? (
        <AppIcon
          icon={Check}
          size={
            size === 'sm'
              ? 'xs'
              : 'sm'
          }
          colorToken={
            colors.content
          }
          decorative
        />
      ) : leadingIcon ? (
        <AppIcon
          icon={leadingIcon}
          size={
            size === 'sm'
              ? 'xs'
              : 'sm'
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
            size === 'sm'
              ? 'labelMedium'
              : 'labelLarge'
          }
          colorToken={
            colors.content
          }
          numberOfLines={1}
        >
          {children}
        </AppText>
      ) : (
        children
      )}
    </AppInline>
  );

  return (
    <View
      style={[
        styles.container(
          effectiveVariant,
          size,
          colors.container,
          colors.border,
        ),
        style,
      ]}
      testID={testID}
    >
      {mainInteractive ? (
        <AppPressable
          accessibilityRole={
            selectable
              ? 'togglebutton'
              : 'button'
          }
          accessibilityLabel={
            resolvedLabel
          }
          accessibilityState={{
            checked:
              selectable
                ? isSelected
                : undefined,
            selected:
              selectable
                ? isSelected
                : undefined,
            disabled,
          }}
          disabled={disabled}
          interaction="subtle"
          haptic={false}
          radius="full"
          touchTarget={
            size === 'sm'
              ? 'compact'
              : 'minimum'
          }
          stateLayerColorToken={
            colors.stateLayer
          }
          onPress={
            handleMainPress
          }
          style={styles.main}
        >
          {mainContent}
        </AppPressable>
      ) : (
        <View style={styles.mainStatic}>
          {mainContent}
        </View>
      )}

      {onDismiss ? (
        <AppIconButton
          icon={X}
          size="sm"
          variant="ghost"
          tone={tone}
          disabled={disabled}
          interaction="subtle"
          accessibilityLabel={
            dismissAccessibilityLabel ??
            (textLabel
              ? `${chipCopy.dismiss} ${textLabel}`
              : chipCopy.dismiss)
          }
          onPress={() => {
            void appHaptics.selection();
            onDismiss();
          }}
          style={styles.dismiss}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    container: (
      variant: AppChipVariant,
      size: AppChipSize,
      container:
        | keyof typeof theme.colors
        | undefined,
      border:
        | keyof typeof theme.colors
        | undefined,
    ) => ({
      minHeight:
        size === 'sm'
          ? theme.sizes.control.sm
          : theme.sizes.control.md,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius:
        theme.radius.full,
      backgroundColor:
        container
          ? theme.colors[container]
          : 'transparent',
      borderWidth:
        variant === 'outlined'
          ? 1
          : 0,
      borderColor:
        border
          ? theme.colors[border]
          : 'transparent',
    }),

    main: {
      minWidth: 0,
      flexShrink: 1,
      justifyContent: 'center',
      paddingHorizontal:
        theme.spacing.md,
    },

    mainStatic: {
      minHeight:
        theme.sizes.control.sm,
      minWidth: 0,
      flexShrink: 1,
      justifyContent: 'center',
      paddingHorizontal:
        theme.spacing.md,
    },

    dismiss: {
      marginRight:
        theme.spacing.xs,
    },
  }),
);
