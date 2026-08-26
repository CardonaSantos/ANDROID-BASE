import {
  forwardRef,
  useState,
} from 'react';

import {
  AppField,
} from '../AppField';
import {
  AppInputBase,
} from '../_internal/AppInputBase';
import type {
  AppInputRef,
} from '../AppInput';

import type {
  AppTextAreaProps,
} from './AppTextArea.types';

export const AppTextArea =
  forwardRef<
    AppInputRef,
    AppTextAreaProps
  >(
    (
      {
        label,
        description,
        error,
        required = false,
        disabled = false,
        size = 'md',
        minRows = 4,
        showCharacterCount = false,
        maxLength,
        value,
        defaultValue,
        onChangeText,
        accessibilityLabel,
        inputStyle,
        ...rest
      },
      ref,
    ) => {
      const [
        uncontrolledLength,
        setUncontrolledLength,
      ] = useState(
        defaultValue?.length ?? 0,
      );

      const count =
        typeof value === 'string'
          ? value.length
          : uncontrolledLength;

      const resolvedLabel =
        accessibilityLabel ??
        (typeof label === 'string'
          ? label
          : undefined);

      const counter =
        showCharacterCount
          ? maxLength
            ? `${count}/${maxLength}`
            : String(count)
          : undefined;

      return (
        <AppField
          label={label}
          description={description}
          error={error}
          required={required}
          disabled={disabled}
          size={size}
          counter={counter}
        >
          <AppInputBase
            ref={ref}
            size={size}
            invalid={Boolean(error)}
            editable={!disabled}
            multiline
            numberOfLines={minRows}
            textAlignVertical="top"
            value={value}
            defaultValue={
              defaultValue
            }
            maxLength={maxLength}
            accessibilityLabel={
              resolvedLabel
            }
            inputStyle={[
              {
                minHeight:
                  minRows * 22,
              },
              inputStyle,
            ]}
            onChangeText={(
              text,
            ) => {
              setUncontrolledLength(
                text.length,
              );
              onChangeText?.(text);
            }}
            {...rest}
          />
        </AppField>
      );
    },
  );

AppTextArea.displayName =
  'AppTextArea';
