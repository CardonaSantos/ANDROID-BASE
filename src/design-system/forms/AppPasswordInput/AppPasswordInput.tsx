import {
  forwardRef,
} from 'react';
import {
  Eye,
  EyeOff,
} from 'lucide-react-native';

import {
  AppIconButton,
} from '../../actions';
import {
  useControllableState,
} from '../../hooks';
import {
  AppInput,
  type AppInputRef,
} from '../AppInput';
import { formCopy } from '../form.copy';

import type {
  AppPasswordInputProps,
} from './AppPasswordInput.types';

export const AppPasswordInput =
  forwardRef<
    AppInputRef,
    AppPasswordInputProps
  >(
    (
      {
        visible,
        defaultVisible = false,
        onVisibilityChange,
        showPasswordLabel =
          formCopy.password.show,
        hidePasswordLabel =
          formCopy.password.hide,
        disabled = false,
        ...rest
      },
      ref,
    ) => {
      const controlled =
        visible !== undefined;

      const [
        isVisible,
        setVisible,
      ] =
        useControllableState<boolean>(
          controlled
            ? {
                value: visible,
                defaultValue:
                  defaultVisible,
                onValueChange:
                  onVisibilityChange,
              }
            : {
                defaultValue:
                  defaultVisible,
                onValueChange:
                  onVisibilityChange,
              },
        );

      return (
        <AppInput
          ref={ref}
          disabled={disabled}
          secureTextEntry={
            !isVisible
          }
          trailing={
            <AppIconButton
              icon={
                isVisible
                  ? EyeOff
                  : Eye
              }
              size="sm"
              variant="ghost"
              tone="neutral"
              disabled={disabled}
              interaction="subtle"
              accessibilityLabel={
                isVisible
                  ? hidePasswordLabel
                  : showPasswordLabel
              }
              onPress={() => {
                setVisible(
                  (current) =>
                    !current,
                );
              }}
            />
          }
          {...rest}
        />
      );
    },
  );

AppPasswordInput.displayName =
  'AppPasswordInput';
