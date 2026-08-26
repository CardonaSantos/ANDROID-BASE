interface ResolveAccessibilityLabelInput {
  explicit?: string;
  fallback?: string;
}

/**
 * Prefer an explicit domain-meaningful label when one is supplied. Otherwise
 * fall back to visible text.
 *
 * This utility intentionally does NOT append the role ("button", "link", ...)
 * because assistive technology announces roles separately.
 */
export const resolveAccessibilityLabel = ({
  explicit,
  fallback,
}: ResolveAccessibilityLabelInput):
  | string
  | undefined => {
  const value = explicit ?? fallback;

  if (!value) {
    return undefined;
  }

  const normalized = value
    .replace(/\s+/g, ' ')
    .trim();

  return normalized.length > 0
    ? normalized
    : undefined;
};

/**
 * Development helper for icon-only controls.
 */
export const requireAccessibilityLabel = (
  label: string | undefined,
  componentName: string,
): string | undefined => {
  const normalized = resolveAccessibilityLabel({
    explicit: label,
  });

  if (
    __DEV__ &&
    normalized === undefined
  ) {
    console.warn(
      `[NOVA accessibility] ${componentName} requires an accessibilityLabel because it has no visible text label.`,
    );
  }

  return normalized;
};
