import {
  forwardRef,
  type ComponentRef,
} from 'react';
import { View } from 'react-native';

import { AppStack } from '../AppStack';

import type {
  AppSectionProps,
} from './AppSection.types';

export const AppSection = forwardRef<
  ComponentRef<typeof View>,
  AppSectionProps
>(
  (
    {
      children,
      header,
      gap = 'lg',
      style,
      ...rest
    },
    ref,
  ) => (
    <AppStack
      ref={ref}
      gap={gap}
      style={style}
      {...rest}
    >
      {header}
      {children}
    </AppStack>
  ),
);

AppSection.displayName = 'AppSection';
