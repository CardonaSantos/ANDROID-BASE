import {
  Children,
} from 'react';
import { View } from 'react-native';

import {
  useResponsiveValue,
} from '../../hooks';
import { spacing } from '../../tokens';

import type {
  AppActionGroupAlign,
  AppActionGroupProps,
} from './AppActionGroup.types';

const horizontalJustify = (
  align: AppActionGroupAlign,
) => {
  switch (align) {
    case 'center':
      return 'center' as const;

    case 'end':
      return 'flex-end' as const;

    case 'start':
    case 'stretch':
    default:
      return 'flex-start' as const;
  }
};

const verticalAlign = (
  align: AppActionGroupAlign,
) => {
  switch (align) {
    case 'center':
      return 'center' as const;

    case 'end':
      return 'flex-end' as const;

    case 'start':
      return 'flex-start' as const;

    case 'stretch':
    default:
      return 'stretch' as const;
  }
};

/**
 * Responsive action composition.
 *
 * `auto` uses a vertical stack on compact widths and a horizontal action row
 * from medium upward. Visual-only responsive concerns remain in Unistyles;
 * this hook is used because child flow/order is behavioral layout composition.
 */
export const AppActionGroup = ({
  children,
  orientation = 'auto',
  align = 'end',
  gap = 'md',
  reverse = false,
  style,
  testID,
}: AppActionGroupProps) => {
  const automaticOrientation =
    useResponsiveValue({
      compact: 'vertical',
      medium: 'horizontal',
    });

  const resolvedOrientation =
    orientation === 'auto'
      ? automaticOrientation
      : orientation;

  const items =
    Children.toArray(children);

  if (reverse) {
    items.reverse();
  }

  const horizontal =
    resolvedOrientation ===
    'horizontal';

  return (
    <View
      accessible={false}
      testID={testID}
      style={[
        {
          flexDirection:
            horizontal
              ? 'row'
              : 'column',
          gap: spacing[gap],
          justifyContent:
            horizontal
              ? horizontalJustify(
                  align,
                )
              : undefined,
          alignItems:
            horizontal
              ? 'center'
              : verticalAlign(
                  align,
                ),
        },
        style,
      ]}
    >
      {items}
    </View>
  );
};
