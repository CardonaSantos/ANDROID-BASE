import {
  Children,
  forwardRef,
  type ComponentRef,
} from 'react';
import { View } from 'react-native';

import { spacing } from '../../tokens';

import type {
  AppGridProps,
} from './AppGrid.types';

/**
 * Flex-based adaptive grid.
 *
 * For very large virtualized collections use the future AppGridList/FlashList
 * component instead. AppGrid is intended for ordinary page sections/forms.
 */
export const AppGrid = forwardRef<
  ComponentRef<typeof View>,
  AppGridProps
>(
  (
    {
      children,
      gap = 'lg',
      rowGap,
      columnGap,
      minItemWidth = 160,
      maxItemWidth,
      alignItems = 'stretch',
      style,
      itemStyle,
      ...rest
    },
    ref,
  ) => {
    const childArray =
      Children.toArray(children);

    return (
      <View
        ref={ref}
        style={[
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing[gap],
            rowGap: rowGap
              ? spacing[rowGap]
              : undefined,
            columnGap: columnGap
              ? spacing[columnGap]
              : undefined,
            alignItems,
          },
          style,
        ]}
        {...rest}
      >
        {childArray.map(
          (child, index) => (
            <View
              // Children.toArray already normalizes child identity; index is
              // acceptable for this static layout wrapper.
              key={index}
              style={[
                {
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis:
                    minItemWidth,
                  maxWidth:
                    maxItemWidth,
                  minWidth:
                    minItemWidth,
                },
                itemStyle,
              ]}
            >
              {child}
            </View>
          ),
        )}
      </View>
    );
  },
);

AppGrid.displayName = 'AppGrid';
