import {
  Search,
  X,
} from 'lucide-react-native';

import {
  AppIconButton,
} from '../../actions';
import {
  useSearchHandler,
} from '../../hooks';
import {
  AppIcon,
} from '../../primitives';
import {
  AppInput,
} from '../AppInput';
import { formCopy } from '../form.copy';

import type {
  AppSearchInputProps,
} from './AppSearchInput.types';

export const AppSearchInput = ({
  value,
  defaultValue = '',
  onValueChange,
  onSearch,
  debounceMs = 300,
  minimumLength = 0,
  searchOnMount = false,
  showClearButton = true,
  clearAccessibilityLabel =
    formCopy.search.clear,
  returnKeyType = 'search',
  ...rest
}: AppSearchInputProps) => {
  const controlled =
    value !== undefined;

  const search =
    useSearchHandler(
      controlled
        ? {
            value,
            defaultValue,
            onValueChange,
            onSearch,
            debounceMs,
            minimumLength,
            searchOnMount,
          }
        : {
            defaultValue,
            onValueChange,
            onSearch,
            debounceMs,
            minimumLength,
            searchOnMount,
          },
    );

  return (
    <AppInput
      value={search.value}
      onChangeText={
        search.setValue
      }
      returnKeyType={
        returnKeyType
      }
      onSubmitEditing={() => {
        void search.submit();
      }}
      leading={
        <AppIcon
          icon={Search}
          size="md"
          tone="muted"
          decorative
        />
      }
      trailing={
        showClearButton &&
        search.value.length >
          0 ? (
          <AppIconButton
            icon={X}
            size="sm"
            variant="ghost"
            tone="neutral"
            interaction="subtle"
            accessibilityLabel={
              clearAccessibilityLabel
            }
            onPress={search.clear}
          />
        ) : undefined
      }
      {...rest}
    />
  );
};
