import type {
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import {
  useController,
} from 'react-hook-form';

import type {
  AppFormFieldProps,
} from './AppFormField.types';

/**
 * Thin React Hook Form adapter.
 *
 * It keeps RHF wiring out of visual components while exposing the library's
 * official field/fieldState/formState contracts unchanged.
 */
export const AppFormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  props:
    AppFormFieldProps<
      TFieldValues,
      TName
    >,
) => {
  const {
    children,
    ...controllerProps
  } = props;

  const {
    field,
    fieldState,
    formState,
  } = useController(
    controllerProps,
  );

  const message =
    fieldState.error?.message;

  return children({
    field,
    fieldState,
    formState,
    errorMessage:
      typeof message === 'string'
        ? message
        : undefined,
  });
};
