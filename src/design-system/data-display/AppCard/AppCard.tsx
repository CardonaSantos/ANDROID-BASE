import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  AppPressable,
  AppSurface,
} from '../../primitives';

import type {
  AppCardProps,
} from './AppCard.types';

export const AppCard = ({
  children,
  variant = 'outlined',
  tone = 'neutral',
  radius = 'lg',
  padding = 'lg',
  elevation,
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
}: AppCardProps) => {
  const interactive =
    Boolean(onPress || onLongPress);

  const surface = (
    <AppSurface
      variant={variant}
      tone={tone}
      radius={radius}
      padding={padding}
      elevation={elevation}
      style={[
        styles.surface(selected),
        contentStyle,
      ]}
    >
      {children}
    </AppSurface>
  );

  if (!interactive) {
    return (
      <View
        style={style}
        testID={testID}
      >
        {surface}
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
        accessibilityLabel
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
      radius={radius}
      stateLayerColorToken={
        selected
          ? 'primaryStrong'
          : 'text'
      }
      touchTarget="none"
      onPress={onPress}
      onLongPress={onLongPress}
      style={style}
      testID={testID}
    >
      {surface}
    </AppPressable>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    surface: (
      selected: boolean,
    ) => ({
      borderColor:
        selected
          ? theme.colors
              .primaryStrong
          : undefined,
    }),
  }),
);
