import {
  forwardRef,
  type ComponentRef,
} from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type {
  AppContainerProps,
  AppContainerWidth,
} from './AppContainer.types';

export const AppContainer = forwardRef<
  ComponentRef<typeof View>,
  AppContainerProps
>(
  (
    {
      children,
      maxWidth = 'page',
      gutter = 'standard',
      style,
      ...rest
    },
    ref,
  ) => {
    styles.useVariants({
      gutter,
    });

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          styles.maxWidth(maxWidth),
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  },
);

AppContainer.displayName =
  'AppContainer';

const styles = StyleSheet.create(
  (theme) => ({
    container: {
      width: '100%',
      alignSelf: 'center',

      variants: {
        gutter: {
          none: {
            paddingHorizontal: 0,
          },

          standard: {
            paddingHorizontal: {
              compact:
                theme.spacing.lg,
              medium:
                theme.spacing['2xl'],
              expanded:
                theme.spacing['3xl'],
              wide:
                theme.spacing['4xl'],
            },
          },
        },
      },
    },

    maxWidth: (
      maxWidth: AppContainerWidth,
    ) => {
      switch (maxWidth) {
        case 'compact':
          return {
            maxWidth:
              theme.sizes.content
                .compactMaxWidth,
          };

        case 'readable':
          return {
            maxWidth:
              theme.sizes.content
                .readableMaxWidth,
          };

        case 'page':
          return {
            maxWidth:
              theme.sizes.content
                .pageMaxWidth,
          };

        case 'none':
        default:
          return {};
      }
    },
  }),
);
