/**
 * NOVA Design System bootstrap.
 *
 * This module must be evaluated before any component that calls
 * react-native-unistyles StyleSheet.create with a theme callback.
 *
 * Keeping initialization in one side-effect module makes the order explicit
 * for:
 * - the normal Expo entry;
 * - Expo Router's Web/server renderer;
 * - isolated imports of the Design System public barrel.
 */
import './theme/unistyles';
import './theme/theme-controller';
