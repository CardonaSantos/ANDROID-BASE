# NOVA Design System — Pack 7 validation

Run:

```bash
npx tsc --noEmit
npm run lint
npx expo start --clear
```

## Collection checks

- AppList basic list and pull-to-refresh.
- AppList with ListEmptyComponent.
- AppInfiniteFooter all four states.
- AppGridList fixed columns.
- AppGridList responsive columns.
- AppGridList masonry.
- orientation/breakpoint changes.
- FlashList refs.

Performance must be evaluated in release mode, not JS development mode.

## Media checks

### Web
- carousel swipe/scroll;
- controlled index;
- indicators;
- gallery placeholder/fallback;
- image caching.

### Native
- Expo UI PagerView swipe;
- imperative index synchronization;
- Android paging;
- iOS paging;
- VoiceOver/TalkBack page value;
- large images and memory behavior.

## Source guards

No use of FlashList v1 APIs:
- estimatedItemSize
- estimatedListSize
- estimatedFirstItemOffset
- onBlankArea
- disableAutoLayout
- MasonryFlashList

No:
- ElementRef
- as any
- explicit : any
- @/design-system self imports
- TouchableOpacity / TouchableHighlight

## Catalog

The catalog inventory must have no duplicate component names.

The production root `src/design-system/index.ts` must not export the catalog
registry; development tooling imports it explicitly.
