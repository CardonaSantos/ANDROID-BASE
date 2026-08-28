/**
 * Application-specific backend adapters are registered here.
 *
 * The reusable base intentionally does not hardcode:
 * - authentication refresh endpoints;
 * - current-user endpoints;
 * - backend DTO shapes.
 *
 * When a consuming application implements those contracts, register
 * configureAuthRefreshHandler(...) and configureCurrentUserLoader(...)
 * in this module. Because index.ts imports this file before
 * expo-router/entry, the adapters will exist before App Core boots.
 */

export {};
