import { useCallback } from 'react';

import type { OpenChangeHandler } from '../contracts';

import { useControllableState } from './use-controllable-state';

export interface UseDisclosureOptions {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OpenChangeHandler;
}

export const useDisclosure = (
  options: UseDisclosureOptions = {},
) => {
  const isControlled =
    Object.prototype.hasOwnProperty.call(
      options,
      'open',
    );

  const stateOptions = isControlled
    ? {
        value: options.open as boolean,
        defaultValue:
          options.defaultOpen ?? false,
        onValueChange:
          options.onOpenChange,
      }
    : {
        defaultValue:
          options.defaultOpen ?? false,
        onValueChange:
          options.onOpenChange,
      };

  const [isOpen, setOpen] =
    useControllableState<boolean>(
      stateOptions,
    );

  const open = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, [setOpen]);

  return {
    isOpen,
    setOpen,
    open,
    close,
    toggle,
  } as const;
};
