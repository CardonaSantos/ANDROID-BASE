import {
  forwardRef,
  type ComponentRef,
} from 'react';
import { View } from 'react-native';

import type {
  AppCenterProps,
} from './AppCenter.types';

export const AppCenter = forwardRef<
  ComponentRef<typeof View>,
  AppCenterProps
>(
  (
    {
      children,
      axis = 'both',
      fill = false,
      style,
      ...rest
    },
    ref,
  ) => (
    <View
      ref={ref}
      style={[
        {
          flex: fill ? 1 : undefined,
          alignItems:
            axis === 'both' ||
            axis === 'horizontal'
              ? 'center'
              : undefined,
          justifyContent:
            axis === 'both' ||
            axis === 'vertical'
              ? 'center'
              : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  ),
);

AppCenter.displayName = 'AppCenter';
