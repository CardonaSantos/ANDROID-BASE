import {
  ActivityIndicator,
  View,
} from 'react-native';
import {
  StyleSheet,
  useUnistyles,
} from 'react-native-unistyles';

import {
  resolveActionColorTokens,
} from '../../actions/action-colors';
import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  AppText,
} from '../../primitives';

import {
  feedbackCopy,
} from '../feedback.copy';

import type {
  AppLoadingProps,
} from './AppLoading.types';

const indicatorSize = {
  sm: 'small',
  md: 'small',
  lg: 'large',
} as const;

export const AppLoading = ({
  label,
  size = 'md',
  tone = 'primary',
  layout = 'inline',
  accessibilityLabel,
  style,
  testID,
}: AppLoadingProps) => {
  const { theme } =
    useUnistyles();

  const colors =
    resolveActionColorTokens(
      'ghost',
      tone,
      false,
    );

  const visibleLabel =
    label ??
    (layout === 'block'
      ? feedbackCopy.loading.label
      : undefined);

  const resolvedLabel =
    accessibilityLabel ??
    (typeof visibleLabel ===
      'string' ||
    typeof visibleLabel ===
      'number'
      ? String(visibleLabel)
      : feedbackCopy.loading
          .label);

  const indicator = (
    <ActivityIndicator
      size={
        indicatorSize[size]
      }
      color={
        theme.colors[
          colors.content
        ]
      }
    />
  );

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={
        resolvedLabel
      }
      accessibilityState={{
        busy: true,
      }}
      accessibilityLiveRegion="polite"
      testID={testID}
      style={style}
    >
      {layout === 'block' ? (
        <AppStack
          gap="md"
          align="center"
        >
          {indicator}

          {visibleLabel ? (
            <AppText
              variant={
                size === 'sm'
                  ? 'bodySmall'
                  : 'bodyMedium'
              }
              tone="secondary"
              accessible={false}
            >
              {visibleLabel}
            </AppText>
          ) : null}
        </AppStack>
      ) : (
        <AppInline
          gap="sm"
          align="center"
        >
          {indicator}

          {visibleLabel ? (
            <AppText
              variant={
                size === 'sm'
                  ? 'bodySmall'
                  : 'bodyMedium'
              }
              tone="secondary"
              accessible={false}
            >
              {visibleLabel}
            </AppText>
          ) : null}
        </AppInline>
      )}
    </View>
  );
};
