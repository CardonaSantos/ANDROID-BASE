import {
  View,
} from 'react-native';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  useControllableState,
  useResponsiveValue,
} from '../../hooks';

import {
  AppBottomNavigation,
} from '../AppBottomNavigation';
import {
  AppNavigationRail,
} from '../AppNavigationRail';

import type {
  AppAdaptiveNavigationProps,
} from './AppAdaptiveNavigation.types';

type AdaptiveNavigationMode =
  | 'bottom'
  | 'rail';

export const AppAdaptiveNavigation = <
  TValue extends string,
>({
  children,
  items,
  value,
  defaultValue,
  onValueChange,
  railFrom = 'expanded',
  railHeader,
  railFooter,
  showLabels = true,
  style,
  contentStyle,
  testID,
}: AppAdaptiveNavigationProps<TValue>) => {
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

  const mode =
    useResponsiveValue<
      AdaptiveNavigationMode
    >({
      compact: 'bottom',
      medium:
        railFrom ===
          'medium'
          ? 'rail'
          : 'bottom',
      expanded:
        railFrom ===
          'medium' ||
        railFrom ===
          'expanded'
          ? 'rail'
          : 'bottom',
      wide: 'rail',
    });

  if (mode === 'rail') {
    return (
      <View
        style={[
          styles.railRoot,
          style,
        ]}
        testID={testID}
      >
        <AppNavigationRail
          items={items}
          value={
            selectedValue
          }
          onValueChange={
            setSelectedValue
          }
          header={
            railHeader
          }
          footer={
            railFooter
          }
          showLabels={
            showLabels
          }
        />

        <View
          style={[
            styles.content,
            contentStyle,
          ]}
        >
          {children}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.bottomRoot,
        style,
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.content,
          contentStyle,
        ]}
      >
        {children}
      </View>

      <AppBottomNavigation
        items={items}
        value={
          selectedValue
        }
        onValueChange={
          setSelectedValue
        }
        showLabels={
          showLabels
        }
      />
    </View>
  );
};

const styles = StyleSheet.create(
  () => ({
    railRoot: {
      flex: 1,
      flexDirection: 'row',
    },

    bottomRoot: {
      flex: 1,
      flexDirection: 'column',
    },

    content: {
      minWidth: 0,
      flex: 1,
    },
  }),
);
