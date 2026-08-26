import type {
  ReactNode,
} from 'react';
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
  UseFormStateReturn,
} from 'react-hook-form';

export interface AppFormFieldRenderContext<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  field:
    ControllerRenderProps<
      TFieldValues,
      TName
    >;

  fieldState:
    ControllerFieldState;

  formState:
    UseFormStateReturn<TFieldValues>;

  errorMessage?: string;
}

export interface AppFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<
    TFieldValues,
    TName
  > {
  children: (
    context:
      AppFormFieldRenderContext<
        TFieldValues,
        TName
      >,
  ) => ReactNode;
}
