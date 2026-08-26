import type {
  ComponentTone,
  SemanticColorToken,
  VisualVariant,
} from '../contracts';

export interface ActionColorTokens {
  container?: SemanticColorToken;
  content: SemanticColorToken;
  border?: SemanticColorToken;
  stateLayer: SemanticColorToken;
}

const solidToneTokens: Record<
  ComponentTone,
  Pick<
    ActionColorTokens,
    'container' | 'content'
  >
> = {
  neutral: {
    container: 'secondary',
    content: 'onSecondary',
  },
  primary: {
    container: 'primary',
    content: 'onPrimary',
  },
  success: {
    container: 'success',
    content: 'onSuccess',
  },
  warning: {
    container: 'warning',
    content: 'onWarning',
  },
  danger: {
    container: 'danger',
    content: 'onDanger',
  },
  info: {
    container: 'info',
    content: 'onInfo',
  },
};

const softToneTokens: Record<
  ComponentTone,
  Pick<
    ActionColorTokens,
    'container' | 'content'
  >
> = {
  neutral: {
    container: 'surfaceSecondary',
    content: 'text',
  },
  primary: {
    container: 'primaryContainer',
    content: 'onPrimaryContainer',
  },
  success: {
    container: 'successContainer',
    content: 'onSuccessContainer',
  },
  warning: {
    container: 'warningContainer',
    content: 'onWarningContainer',
  },
  danger: {
    container: 'dangerContainer',
    content: 'onDangerContainer',
  },
  info: {
    container: 'infoContainer',
    content: 'onInfoContainer',
  },
};

/**
 * Text/icon colors used by outlined/ghost controls must maintain text
 * contrast against the normal application surfaces.
 *
 * Warning intentionally uses onWarningContainer instead of warning itself
 * because the main warning fill is optimized as a container, not as small
 * foreground text on a light surface.
 */
const foregroundToneTokens: Record<
  ComponentTone,
  SemanticColorToken
> = {
  neutral: 'text',
  primary: 'primaryStrong',
  success: 'success',
  warning: 'onWarningContainer',
  danger: 'danger',
  info: 'info',
};

export const resolveActionColorTokens = (
  variant: VisualVariant,
  tone: ComponentTone,
  disabled = false,
): ActionColorTokens => {
  if (disabled) {
    return {
      container:
        variant === 'solid' ||
        variant === 'soft'
          ? 'surfaceSecondary'
          : undefined,
      content: 'textDisabled',
      border:
        variant === 'outlined'
          ? 'border'
          : undefined,
      stateLayer: 'textDisabled',
    };
  }

  if (variant === 'solid') {
    const tokens =
      solidToneTokens[tone];

    return {
      ...tokens,
      stateLayer: tokens.content,
    };
  }

  if (variant === 'soft') {
    const tokens =
      softToneTokens[tone];

    return {
      ...tokens,
      stateLayer: tokens.content,
    };
  }

  const content =
    foregroundToneTokens[tone];

  return {
    content,
    border:
      variant === 'outlined'
        ? tone === 'neutral'
          ? 'borderStrong'
          : content
        : undefined,
    stateLayer: content,
  };
};
