import {
  forwardRef,
  type ComponentRef,
} from 'react';
import { View } from 'react-native';

import { spacing } from '../../tokens';

import type {
  AppStackProps,
} from './AppStack.types';

export const AppStack = forwardRef<
  ComponentRef<typeof View>,
  AppStackProps
>(
  (
    {
      children,
      gap = 'md',
      align,
      justify,
      flex,
      style,
      ...rest
    },
    ref,
  ) => (
    <View
      ref={ref}
      style={[
        {
          flexDirection: 'column',
          gap: spacing[gap],
          alignItems: align,
          justifyContent: justify,
          flex:
            flex === true
              ? 1
              : typeof flex ===
                  'number'
                ? flex
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

AppStack.displayName = 'AppStack';
