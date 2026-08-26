# NOVA Design System — Pack 4 validation

Run in the actual Expo SDK 57 project:

```bash
npx tsc --noEmit
npm run lint
npx expo start --clear
```

## Source guards

Pack 4 must contain no:
- ElementRef
- as any
- explicit : any
- setAccessibilityFocus(...)
- TouchableOpacity / TouchableHighlight
- experimental_accessibilityOrder
- hardcoded animation durations inside Data Display components

## Web checks

- AppCard static / interactive / selected.
- AppListItem sizes, description, metadata and disclosure.
- AppAvatar image, placeholder, initials and fallback icon.
- Badge solid / soft / outlined / dot.
- Chip action / selected / controlled / uncontrolled / dismiss.
- Accordion controlled/uncontrolled expansion and keyboard activation.
- Accordion Reduced Motion behavior.
- SectionHeader action alignment.
- Stat plain / outlined / tonal.
- Light / dark / system theme.

## Native checks

- AppCard and ListItem touch targets.
- TalkBack / VoiceOver labels.
- Badge dot-only accessibility label.
- Chip togglebutton checked state.
- Chip dismiss action as a separate accessible element.
- Accordion expanded/collapsed announcement.
- Dynamic Type in rows, badges and stats.
- Expo Image avatar caching/fallback.
