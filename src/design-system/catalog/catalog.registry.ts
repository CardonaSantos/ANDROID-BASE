import type {
  DesignSystemCatalogEntry,
} from './catalog.types';

/**
 * Public component inventory.
 *
 * This is intentionally metadata-only: it can power a development catalog,
 * docs page or screenshot-test harness without importing every component into
 * one production bundle.
 */
export const designSystemCatalog =
  [
    // Primitives
    { name: 'AppText', family: 'primitives' },
    { name: 'AppIcon', family: 'primitives' },
    { name: 'AppImage', family: 'primitives' },
    { name: 'AppPressable', family: 'primitives' },
    { name: 'AppSurface', family: 'primitives' },
    { name: 'AppDivider', family: 'primitives' },
    { name: 'AppSpacer', family: 'primitives' },
    { name: 'AppPortal', family: 'primitives' },

    // Layout
    { name: 'AppScreen', family: 'layout' },
    { name: 'AppScrollScreen', family: 'layout' },
    { name: 'AppKeyboardScreen', family: 'layout' },
    { name: 'AppContainer', family: 'layout' },
    { name: 'AppStack', family: 'layout' },
    { name: 'AppInline', family: 'layout' },
    { name: 'AppCenter', family: 'layout' },
    { name: 'AppGrid', family: 'layout' },
    { name: 'AppSection', family: 'layout' },

    // Actions
    { name: 'AppButton', family: 'actions' },
    { name: 'AppIconButton', family: 'actions' },
    { name: 'AppBackButton', family: 'actions' },
    { name: 'AppLinkButton', family: 'actions' },
    { name: 'AppFab', family: 'actions' },
    { name: 'AppSegmentedControl', family: 'actions' },
    { name: 'AppActionGroup', family: 'actions' },

    // Forms
    { name: 'AppField', family: 'forms' },
    { name: 'AppInput', family: 'forms' },
    { name: 'AppPasswordInput', family: 'forms' },
    { name: 'AppTextArea', family: 'forms' },
    { name: 'AppSearchInput', family: 'forms' },
    { name: 'AppCheckbox', family: 'forms' },
    { name: 'AppRadio', family: 'forms' },
    { name: 'AppRadioGroup', family: 'forms' },
    { name: 'AppSwitch', family: 'forms' },
    { name: 'AppSelect', family: 'forms' },
    { name: 'AppSlider', family: 'forms' },
    { name: 'AppDatePicker', family: 'forms' },
    { name: 'AppTimePicker', family: 'forms' },
    { name: 'AppFormField', family: 'forms' },

    // Data display
    { name: 'AppCard', family: 'data-display' },
    { name: 'AppListItem', family: 'data-display' },
    { name: 'AppAvatar', family: 'data-display' },
    { name: 'AppBadge', family: 'data-display' },
    { name: 'AppChip', family: 'data-display' },
    { name: 'AppAccordion', family: 'data-display' },
    { name: 'AppSectionHeader', family: 'data-display' },
    { name: 'AppStat', family: 'data-display' },

    // Feedback
    { name: 'AppLoading', family: 'feedback' },
    { name: 'AppProgress', family: 'feedback' },
    { name: 'AppSkeleton', family: 'feedback' },
    { name: 'AppAlert', family: 'feedback' },
    { name: 'AppConnectivityBanner', family: 'feedback' },

    // States
    { name: 'AppStateView', family: 'states' },
    { name: 'AppEmptyState', family: 'states' },
    { name: 'AppErrorState', family: 'states' },
    { name: 'AppOfflineState', family: 'states' },
    { name: 'AppNoResultsState', family: 'states' },
    { name: 'AppPermissionState', family: 'states' },

    // Overlays
    { name: 'AppToast', family: 'overlays' },
    { name: 'AppSnackbar', family: 'overlays' },
    { name: 'AppDialog', family: 'overlays' },
    { name: 'AppConfirmDialog', family: 'overlays' },
    { name: 'AppBottomSheet', family: 'overlays' },
    { name: 'AppMenu', family: 'overlays' },

    // Navigation
    { name: 'AppTopBar', family: 'navigation' },
    { name: 'AppTabs', family: 'navigation' },
    { name: 'AppBottomNavigation', family: 'navigation' },
    { name: 'AppNavigationRail', family: 'navigation' },
    { name: 'AppAdaptiveNavigation', family: 'navigation' },

    // Collections
    { name: 'AppList', family: 'collections' },
    { name: 'AppGridList', family: 'collections' },
    { name: 'AppRefreshControl', family: 'collections' },
    { name: 'AppInfiniteFooter', family: 'collections' },

    // Media
    { name: 'AppCarousel', family: 'media' },
    { name: 'AppImageGallery', family: 'media' },
  ] as const satisfies
    readonly DesignSystemCatalogEntry[];
