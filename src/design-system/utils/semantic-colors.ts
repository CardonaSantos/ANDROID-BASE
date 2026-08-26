import type {
  ContentTone,
  SemanticColorToken,
} from '../contracts';
import type { AppTheme } from '../theme/theme.types';

export const resolveContentColorToken = (
  tone: ContentTone,
): SemanticColorToken => {
  switch (tone) {
    case 'secondary':
      return 'textSecondary';

    case 'muted':
      return 'textMuted';

    case 'disabled':
      return 'textDisabled';

    case 'inverse':
      return 'textInverse';

    case 'primary':
      return 'primaryStrong';

    case 'success':
      return 'success';

    case 'warning':
      return 'warning';

    case 'danger':
      return 'danger';

    case 'info':
      return 'info';

    case 'default':
    default:
      return 'text';
  }
};

export const resolveContentColor = (
  theme: AppTheme,
  tone: ContentTone,
  colorToken?: SemanticColorToken,
): string =>
  theme.colors[
    colorToken ?? resolveContentColorToken(tone)
  ];

export const resolveToneContainerColor = (
  theme: AppTheme,
  tone:
    | 'neutral'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info',
): string => {
  switch (tone) {
    case 'primary':
      return theme.colors.primaryContainer;

    case 'success':
      return theme.colors.successContainer;

    case 'warning':
      return theme.colors.warningContainer;

    case 'danger':
      return theme.colors.dangerContainer;

    case 'info':
      return theme.colors.infoContainer;

    case 'neutral':
    default:
      return theme.colors.surfaceSecondary;
  }
};

export const resolveToneContentColor = (
  theme: AppTheme,
  tone:
    | 'neutral'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info',
): string => {
  switch (tone) {
    case 'primary':
      return theme.colors.onPrimaryContainer;

    case 'success':
      return theme.colors.onSuccessContainer;

    case 'warning':
      return theme.colors.onWarningContainer;

    case 'danger':
      return theme.colors.onDangerContainer;

    case 'info':
      return theme.colors.onInfoContainer;

    case 'neutral':
    default:
      return theme.colors.text;
  }
};
