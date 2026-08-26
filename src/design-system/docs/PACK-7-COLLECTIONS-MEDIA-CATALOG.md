# NOVA Design System — Pack 7 / Collections + Media + Catalog

Pack 7 is cumulative over Foundation v3.2 + Packs 1.1, 2.1, 3.1, 4.1, 5.1
and 6.2.

This is the final functional component pack of the first NOVA Design System
baseline.

## New public components

### Collections
1. AppList
2. AppGridList
3. AppRefreshControl
4. AppInfiniteFooter

### Media
5. AppCarousel
6. AppImageGallery

### Catalog infrastructure
- designSystemCatalog
- DesignSystemCatalogEntry
- DesignSystemFamily

The catalog registry is intentionally not exported by the production root
barrel. Development tooling can import:

```ts
src/design-system/catalog
```

directly.

## FlashList v2

The project uses @shopify/flash-list 2.0.2.

Pack 7 is written specifically for FlashList v2.

Do not add:
- estimatedItemSize
- estimatedListSize
- estimatedFirstItemOffset
- onBlankArea
- disableAutoLayout
- MasonryFlashList

FlashList v2 no longer requires size estimates and `MasonryFlashList` has been
replaced by the `masonry` prop.

NOVA requires a `keyExtractor` in AppList/AppGridList even though FlashList's
underlying prop remains optional. FlashList v2 strongly recommends stable keys
to avoid visible layout glitches.

## AppList

Thin performant list wrapper.

Keeps FlashList's public list capabilities while standardizing:
- required stable keyExtractor,
- NOVA refresh control,
- ref type from FlashList v2,
- no v1 estimation props added by our API.

Feature code owns:
- empty/error states,
- pagination,
- TanStack Query,
- item memoization,
- heterogeneous getItemType when needed.

## AppGridList

FlashList v2 grid/masonry wrapper.

Columns can be:
- a fixed number;
- ResponsiveValues<number>.

Changing column count remounts the recycled grid intentionally so FlashList
does not carry an incompatible previous column layout across breakpoint
changes.

Supports FlashList v2:
- masonry
- optimizeItemArrangement
- overrideItemLayout through inherited props.

## AppRefreshControl

React Native RefreshControl with NOVA semantic colors.

It is useful both directly in ScrollView and internally from AppList/
AppGridList.

## AppInfiniteFooter

Presentational footer states:
- idle
- loading
- error
- end

It does not call TanStack Query or know page numbers. Features supply retry and
state.

## Paging architecture

Native AppCarousel uses Expo SDK 57's drop-in PagerView:

```ts
@expo/ui/community/pager-view
```

This wraps Jetpack Compose HorizontalPager on Android and SwiftUI paging on
iOS.

The Expo pager does not support Web, so NOVA uses a platform split:

```text
AppPager.native.tsx
→ @expo/ui/community/pager-view

AppPager.tsx
→ horizontal React Native ScrollView fallback
```

The public AppCarousel API does not leak either implementation.

## AppCarousel

Generic carousel:
- arbitrary item type,
- stable keyExtractor,
- controlled/uncontrolled index,
- fixed height or aspect ratio,
- optional indicators,
- accessibility page value.

No autoplay is included in the baseline. Automatic movement has accessibility
and reduced-motion implications and should be added only for a proven product
requirement.

## AppImageGallery

Specialized AppCarousel using AppImage / Expo Image.

Defaults:
- cachePolicy memory-disk,
- contentFit cover,
- placeholderContentFit matches contentFit,
- recyclingKey from item id,
- decorative images unless an accessibilityLabel is supplied.

Matching placeholderContentFit prevents visual scale changes while the source
image replaces its placeholder.

## Catalog

The metadata registry contains every public baseline component grouped by
family.

It can power:
- a development-only catalog route;
- screenshot tests;
- docs navigation;
- component inventory validation.

A production route is deliberately not injected into `src/app` by the Design
System package. Route ownership belongs to the application shell and avoids
polluting Expo Router typed routes.
