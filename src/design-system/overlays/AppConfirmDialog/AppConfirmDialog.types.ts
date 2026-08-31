import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";

import type {
  ComponentTone,
  MaybePromise,
  OpenChangeHandler,
} from "../../contracts";
import type { AppDialogSize } from "../AppDialog";

export interface AppConfirmDialogProps {
  open?: boolean;
  defaultOpen?: boolean;

  onOpenChange?: OpenChangeHandler;

  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;

  icon?: LucideIcon;

  tone?: ComponentTone;
  size?: AppDialogSize;

  /*
   * Por defecto el diálogo crece
   * naturalmente con su contenido.
   *
   * Activar solamente cuando el body
   * realmente puede exceder el viewport.
   */
  scrollable?: boolean;

  confirmLabel?: string;
  cancelLabel?: string;

  confirmTone?: ComponentTone;

  onConfirm: () => MaybePromise<void>;

  onCancel?: () => void;

  dismissable?: boolean;

  testID?: string;
}
