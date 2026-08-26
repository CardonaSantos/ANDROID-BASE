import {
  AppActionGroup,
  AppButton,
} from '../../actions';
import {
  useActionHandler,
  useControllableState,
} from '../../hooks';

import {
  AppDialog,
} from '../AppDialog';
import {
  overlayCopy,
} from '../overlay.copy';

import type {
  AppConfirmDialogProps,
} from './AppConfirmDialog.types';

export const AppConfirmDialog = ({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  icon,
  tone = 'neutral',
  size = 'sm',
  confirmLabel =
    overlayCopy.confirm.confirm,
  cancelLabel =
    overlayCopy.confirm.cancel,
  confirmTone = 'primary',
  onConfirm,
  onCancel,
  dismissable = true,
  testID,
}: AppConfirmDialogProps) => {
  const controlled =
    open !== undefined;

  const [
    isOpen,
    setOpen,
  ] =
    useControllableState<boolean>(
      controlled
        ? {
            value:
              open ?? false,
            defaultValue:
              defaultOpen,
            onValueChange:
              onOpenChange,
          }
        : {
            defaultValue:
              defaultOpen,
            onValueChange:
              onOpenChange,
          },
    );

  const confirm =
    useActionHandler({
      onAction: onConfirm,
      successFeedback: {
        haptic: 'success',
      },
      errorFeedback: {
        haptic: 'error',
      },
      onSuccess: () => {
        setOpen(false);
      },
    });

  const cancel = () => {
    if (confirm.pending) {
      return;
    }

    setOpen(false);
    onCancel?.();
  };

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={
        setOpen
      }
      title={title}
      description={
        description
      }
      icon={icon}
      tone={tone}
      size={size}
      dismissable={
        dismissable &&
        !confirm.pending
      }
      showCloseButton={false}
      testID={testID}
      actions={
        <AppActionGroup
          orientation="auto"
          align="end"
        >
          <AppButton
            variant="ghost"
            tone="neutral"
            disabled={
              confirm.pending
            }
            onPress={cancel}
          >
            {cancelLabel}
          </AppButton>

          <AppButton
            variant="solid"
            tone={
              confirmTone
            }
            loading={
              confirm.pending
            }
            onPress={() => {
              void confirm.execute();
            }}
          >
            {confirmLabel}
          </AppButton>
        </AppActionGroup>
      }
    >
      {children}
    </AppDialog>
  );
};
