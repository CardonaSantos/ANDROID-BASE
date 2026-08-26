import {
  forwardRef,
} from 'react';
import {
  RefreshControl,
} from 'react-native';
import {
  useUnistyles,
} from 'react-native-unistyles';

import type {
  AppRefreshControlProps,
  AppRefreshControlRef,
} from './AppRefreshControl.types';

export const AppRefreshControl =
  forwardRef<
    AppRefreshControlRef,
    AppRefreshControlProps
  >(
    (
      {
        refreshing,
        colors,
        progressBackgroundColor,
        tintColor,
        titleColor,
        ...rest
      },
      ref,
    ) => {
      const { theme } =
        useUnistyles();

      return (
        <RefreshControl
          ref={ref}
          refreshing={refreshing}
          colors={
            colors ?? [
              theme.colors
                .primaryStrong,
            ]
          }
          progressBackgroundColor={
            progressBackgroundColor ??
            theme.colors.surface
          }
          tintColor={
            tintColor ??
            theme.colors
              .primaryStrong
          }
          titleColor={
            titleColor ??
            theme.colors
              .textSecondary
          }
          {...rest}
        />
      );
    },
  );

AppRefreshControl.displayName =
  'AppRefreshControl';
