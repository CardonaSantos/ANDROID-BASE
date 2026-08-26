import {
  forwardRef,
  type ComponentRef,
} from 'react';
import { View } from 'react-native';

import { spacing } from '../../tokens';

import type {
  AppInlineProps,
} from './AppInline.types';

export const AppInline = forwardRef<
  ComponentRef<typeof View>,
  AppInlineProps
>(
  (
    {
      children,
      gap = 'md',
      align = 'center',
      justify,
      wrap = false,
      reverse = false,
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
          flexDirection: reverse
            ? 'row-reverse'
            : 'row',
          flexWrap: wrap
            ? 'wrap'
            : 'nowrap',
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

AppInline.displayName = 'AppInline';
