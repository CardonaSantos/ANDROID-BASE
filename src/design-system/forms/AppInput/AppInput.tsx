import {
  forwardRef,
} from 'react';
import {
  useUnistyles,
} from 'react-native-unistyles';

import {
  AppField,
} from '../AppField';
import {
  AppInputBase,
} from '../_internal/AppInputBase';

import type {
  AppInputProps,
  AppInputRef,
} from './AppInput.types';

export const AppInput =
  forwardRef<
    AppInputRef,
    AppInputProps
  >(
    (
      {
        label,
        description,
        error,
        required = false,
        disabled = false,
        size = 'md',
        accessibilityLabel,
        fieldStyle,
        editable,
        placeholderTextColor,
        selectionColor,
        cursorColor,
        ...rest
      },
      ref,
    ) => {
      const { theme } =
        useUnistyles();

      const resolvedLabel =
        accessibilityLabel ??
        (typeof label === 'string'
          ? label
          : undefined);

      return (
        <AppField
          label={label}
          description={description}
          error={error}
          required={required}
          disabled={disabled}
          size={size}
          style={fieldStyle}
        >
          <AppInputBase
            ref={ref}
            size={size}
            invalid={Boolean(error)}
            editable={
              disabled
                ? false
                : editable
            }
            accessibilityLabel={
              resolvedLabel
            }
            placeholderTextColor={
              placeholderTextColor ??
              theme.colors.textMuted
            }
            selectionColor={
              selectionColor ??
              theme.colors.primary
            }
            cursorColor={
              cursorColor ??
              theme.colors.primaryStrong
            }
            {...rest}
          />
        </AppField>
      );
    },
  );

AppInput.displayName = 'AppInput';
