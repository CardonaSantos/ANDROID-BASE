import {
  View,
} from 'react-native';
import {
  useUnistyles,
} from 'react-native-unistyles';

import {
  requireAccessibilityLabel,
} from '../../accessibility';
import { sizes } from '../../tokens';
import {
  resolveContentColor,
} from '../../utils';

import type {
  AppIconProps,
} from './AppIcon.types';

/**
 * Lucide wrapper.
 *
 * Accepting the icon component rather than a string registry preserves normal
 * tree-shaking: features import only the Lucide icons they actually use.
 */
export const AppIcon = ({
  icon: Icon,
  size = 'md',
  tone = 'default',
  colorToken,
  decorative = true,
  accessibilityLabel,
  strokeWidth = 2,
  ...rest
}: AppIconProps) => {
  const { theme } = useUnistyles();

  const resolvedSize =
    typeof size === 'number'
      ? size
      : sizes.icon[size];

  const resolvedColor =
    resolveContentColor(
      theme,
      tone,
      colorToken,
    );

  const label = decorative
    ? undefined
    : requireAccessibilityLabel(
        accessibilityLabel,
        'AppIcon',
      );

  const icon = (
    <Icon
      size={resolvedSize}
      color={resolvedColor}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );

  /**
   * Lucide React Native duplicates remaining props onto each SVG child shape.
   * Keep accessibility semantics outside the SVG implementation so Web never
   * receives invalid DOM attributes such as `accessible` on <circle>/<path>.
   */
  if (decorative || !label) {
    return icon;
  }

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={{
        width: resolvedSize,
        height: resolvedSize,
      }}
    >
      {icon}
    </View>
  );
};
