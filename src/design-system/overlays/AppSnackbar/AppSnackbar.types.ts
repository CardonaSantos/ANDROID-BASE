import type {
  FeedbackTone,
} from '../../feedback';
import type {
  OpenChangeHandler,
} from '../../contracts';
import type {
  OverlayAction,
  OverlayDuration,
  OverlayPosition,
} from '../overlay.types';

export interface AppSnackbarProps {
  open?: boolean;
  defaultOpen?: boolean;

  onOpenChange?:
    OpenChangeHandler;

  message: string;

  tone?: FeedbackTone;
  position?: OverlayPosition;

  duration?: OverlayDuration;

  action?: OverlayAction;

  dismissOnAction?: boolean;

  testID?: string;
}
