import { Portal } from 'react-native-paper';

import type {
  AppPortalProps,
} from './AppPortal.types';

/**
 * Render overlays above normal content.
 *
 * Requires AppDesignSystemProvider near the application root because
 * PaperProvider supplies the Portal.Host.
 */
export const AppPortal = ({
  children,
}: AppPortalProps) => (
  <Portal>{children}</Portal>
);
