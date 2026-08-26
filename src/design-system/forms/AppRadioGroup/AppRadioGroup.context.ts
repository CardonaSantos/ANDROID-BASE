import {
  createContext,
  useContext,
} from 'react';

export interface AppRadioGroupContextValue {
  value: string | null;
  disabled: boolean;
  select(value: string): void;
}

export const AppRadioGroupContext =
  createContext<
    AppRadioGroupContextValue
    | undefined
  >(undefined);

export const useAppRadioGroup =
  () =>
    useContext(
      AppRadioGroupContext,
    );
