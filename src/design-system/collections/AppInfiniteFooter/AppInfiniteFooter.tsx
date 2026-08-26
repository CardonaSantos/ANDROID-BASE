import {
  View,
} from 'react-native';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  AppButton,
} from '../../actions';
import {
  AppLoading,
} from '../../feedback-components';
import {
  AppStack,
} from '../../layout';
import {
  AppText,
} from '../../primitives';

import {
  collectionCopy,
} from '../collection.copy';

import type {
  AppInfiniteFooterProps,
} from './AppInfiniteFooter.types';

export const AppInfiniteFooter = ({
  state,
  errorMessage =
    collectionCopy.infinite.error,
  endMessage =
    collectionCopy.infinite.end,
  retryLabel =
    collectionCopy.infinite.retry,
  onRetry,
  style,
  testID,
}: AppInfiniteFooterProps) => {
  if (state === 'idle') {
    return null;
  }

  return (
    <View
      testID={testID}
      style={[
        styles.footer,
        style,
      ]}
    >
      {state === 'loading' ? (
        <AppLoading
          size="sm"
          layout="inline"
          label={
            collectionCopy
              .infinite.loading
          }
        />
      ) : state === 'error' ? (
        <AppStack
          gap="sm"
          align="center"
        >
          <AppText
            variant="bodySmall"
            tone="danger"
            align="center"
            accessibilityRole="alert"
          >
            {errorMessage}
          </AppText>

          {onRetry ? (
            <AppButton
              size="sm"
              variant="ghost"
              tone="primary"
              onPress={onRetry}
            >
              {retryLabel}
            </AppButton>
          ) : null}
        </AppStack>
      ) : (
        <AppText
          variant="caption"
          tone="muted"
          align="center"
        >
          {endMessage}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    footer: {
      width: '100%',
      minHeight:
        theme.sizes.control.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal:
        theme.spacing.lg,
      paddingVertical:
        theme.spacing.lg,
    },
  }),
);
