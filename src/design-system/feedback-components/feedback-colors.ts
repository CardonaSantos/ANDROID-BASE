import type {
  SemanticColorToken,
} from '../contracts';
import type {
  FeedbackTone,
} from '../feedback';

export interface FeedbackToneTokens {
  container: SemanticColorToken;
  content: SemanticColorToken;
  strong: SemanticColorToken;
}

const tokens: Record<
  FeedbackTone,
  FeedbackToneTokens
> = {
  neutral: {
    container: 'surfaceSecondary',
    content: 'text',
    strong: 'text',
  },

  success: {
    container: 'successContainer',
    content: 'onSuccessContainer',
    strong: 'success',
  },

  warning: {
    container: 'warningContainer',
    content: 'onWarningContainer',
    strong: 'onWarningContainer',
  },

  danger: {
    container: 'dangerContainer',
    content: 'onDangerContainer',
    strong: 'danger',
  },

  info: {
    container: 'infoContainer',
    content: 'onInfoContainer',
    strong: 'info',
  },
};

export const resolveFeedbackToneTokens = (
  tone: FeedbackTone,
): FeedbackToneTokens =>
  tokens[tone];
