import {
  useState,
} from 'react';

import {
  useControllableState,
} from '../../hooks';
import {
  AppInput,
} from '../AppInput';
import {
  formatDateForInput,
  parseDateInput,
} from '../date-time.utils';
import { formCopy } from '../form.copy';

import type {
  AppDatePickerProps,
} from './AppDatePicker.types';

export const AppDatePicker = ({
  value,
  defaultValue = new Date(),
  onValueChange,
  minimumDate,
  maximumDate,
  locale: _locale,
  timeZoneName: _timeZoneName,
  style,
  testID,
  placeholder =
    formCopy.date.placeholder,
  invalidWebValueMessage =
    formCopy.date.invalid,
  error,
  ...rest
}: AppDatePickerProps) => {
  const controlled =
    value !== undefined;

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useControllableState<Date>(
      controlled
        ? {
            value,
            defaultValue,
            onValueChange,
          }
        : {
            defaultValue,
            onValueChange,
          },
    );

  const selectedDateKey =
    selectedDate.getTime();

  const [
    draftState,
    setDraftState,
  ] = useState<{
    sourceKey: number;
    value: string;
  } | null>(null);

  const [
    localError,
    setLocalError,
  ] =
    useState<string | null>(
      null,
    );

  const formattedSelectedDate =
    formatDateForInput(
      selectedDate,
    );

  const draft =
    draftState?.sourceKey ===
    selectedDateKey
      ? draftState.value
      : formattedSelectedDate;

  const updateDraft = (
    nextValue: string,
  ) => {
    setDraftState({
      sourceKey:
        selectedDateKey,
      value: nextValue,
    });
  };

  const commit = () => {
    const parsed =
      parseDateInput(draft);

    if (!parsed) {
      setLocalError(
        invalidWebValueMessage,
      );
      return;
    }

    if (
      minimumDate &&
      parsed < minimumDate
    ) {
      setLocalError(
        invalidWebValueMessage,
      );
      return;
    }

    if (
      maximumDate &&
      parsed > maximumDate
    ) {
      setLocalError(
        invalidWebValueMessage,
      );
      return;
    }

    setLocalError(null);
    setSelectedDate(parsed);
  };

  return (
    <AppInput
      value={draft}
      onChangeText={
        updateDraft
      }
      onBlur={commit}
      placeholder={placeholder}
      error={
        error ??
        localError ??
        undefined
      }
      autoCapitalize="none"
      autoCorrect={false}
      fieldStyle={style}
      testID={testID}
      {...rest}
    />
  );
};
