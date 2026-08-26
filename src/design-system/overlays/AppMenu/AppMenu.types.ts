import type {
  ReactNode,
} from 'react';
import type {
  LucideIcon,
} from 'lucide-react-native';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentTone,
  OpenChangeHandler,
} from '../../contracts';

export interface AppMenuAnchorControls {
  open(): void;
  close(): void;
  toggle(): void;

  isOpen: boolean;
}

export type AppMenuEntry =
  | {
      type?: 'item';

      id: string;
      label: string;

      description?: string;

      icon?: LucideIcon;

      tone?: ComponentTone;

      selected?: boolean;
      disabled?: boolean;

      closeOnPress?: boolean;

      onPress: () => void;
    }
  | {
      type: 'separator';
      id: string;
    };

export interface AppMenuProps {
  open?: boolean;
  defaultOpen?: boolean;

  onOpenChange?:
    OpenChangeHandler;

  anchor: (
    controls:
      AppMenuAnchorControls,
  ) => ReactNode;

  items:
    readonly AppMenuEntry[];

  anchorPosition?:
    | 'top'
    | 'bottom';

  overlayAccessibilityLabel?: string;

  contentStyle?:
    StyleProp<ViewStyle>;

  testID?: string;
}
