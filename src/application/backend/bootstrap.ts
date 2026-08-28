/**
 * Application-specific backend adapters are registered here.
 *
 * The reusable base intentionally does not hardcode:
 * - authentication refresh endpoints;
 * - current-user endpoints;
 * - backend DTO shapes.
 *
 * Register configureAuthRefreshHandler(...) and
 * configureCurrentUserLoader(...) here when the consuming
 * application provides those contracts.
 *
 * Root index.ts imports this module before expo-router/entry,
 * so adapters are configured before App Core can boot.
 */

export {};
