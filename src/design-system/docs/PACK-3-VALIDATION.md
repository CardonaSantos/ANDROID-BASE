# NOVA Design System — Pack 3 validation

Run:

```bash
npx tsc --noEmit
npm run lint
npx expo start --clear
```

## TypeScript regression guards

The source should contain none of:

```text
ElementRef
as any
: any
setAccessibilityFocus(...)
DateTimePickerAndroid.open(...)
DateTimePicker onChange=
negativeButton=
```

## Web

Verify:

- AppInput focus/error/disabled/readOnly.
- AppPasswordInput show/hide.
- AppTextArea character count.
- AppSearchInput debounce/clear/submit.
- AppCheckbox mixed/checked.
- AppRadioGroup single selection.
- AppSwitch motion.
- AppSelect open/select/disabled.
- AppSlider mouse/keyboard/screen-reader behavior.
- AppDatePicker YYYY-MM-DD fallback.
- AppTimePicker HH:mm fallback.
- RHF AppFormField adapter.

## Android / iOS

Verify:

- keyboard traversal and Return behavior.
- TalkBack / VoiceOver labels and states.
- large font scaling.
- checkbox/radio/switch haptics.
- reduced-motion state animations.
- Paper Menu overlay positioning.
- Expo UI Slider.
- DateTimePicker:
  - Android dialog opens/closes correctly,
  - iOS compact/native picker,
  - light/dark theme,
  - minimum/maximum date,
  - 12/24-hour time behavior.

## Forms architecture

Feature code should import:

```ts
from '@/design-system'
```

and not:

```ts
from '@/design-system/forms/_internal/AppInputBase'
```

The internal input base is not a public product contract.
