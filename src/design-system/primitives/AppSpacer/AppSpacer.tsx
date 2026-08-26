import { View } from 'react-native';

import { spacing } from '../../tokens';

import type {
  AppSpacerProps,
} from './AppSpacer.types';

export const AppSpacer = ({
  size = 'lg',
  axis = 'vertical',
  style,
  testID,
}: AppSpacerProps) => {
  const value = spacing[size];

  return (
    <View
      accessible={false}
      testID={testID}
      style={[
        axis === 'horizontal'
          ? { width: value }
          : axis === 'both'
            ? {
                width: value,
                height: value,
              }
            : { height: value },
        style,
      ]}
    />
  );
};
