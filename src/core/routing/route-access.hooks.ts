import {
  useQuery,
} from "@tanstack/react-query";

import {
  currentUserQueryOptions,
} from "@/core/access";

import {
  useIsSessionSettled,
  useSessionStatus,
} from "@/core/session";

import {
  evaluateRouteAccess,
  routeRequiresCurrentUser,
} from "./route-access.utils";

import type {
  RouteAccessRequirement,
  RouteAccessResult,
  SessionRouteGuards,
} from "./routing.types";

export function useSessionRouteGuards():
  SessionRouteGuards {
  const isSettled =
    useIsSessionSettled();

  const status =
    useSessionStatus();

  const isAuthenticated =
    isSettled &&
    status === "authenticated";

  return {
    isSettled,

    isAuthenticated,

    authenticatedGuard:
      isAuthenticated,

    guestGuard:
      isSettled &&
      status === "anonymous",
  };
}

export function useAuthenticatedRouteGuard():
  boolean {
  return useSessionRouteGuards()
    .authenticatedGuard;
}

export function useGuestRouteGuard():
  boolean {
  return useSessionRouteGuards()
    .guestGuard;
}

export function useRouteAccess(
  requirement:
    RouteAccessRequirement = {},
): RouteAccessResult {
  const session =
    useSessionRouteGuards();

  const requiresCurrentUser =
    routeRequiresCurrentUser(
      requirement,
    );

  const currentUserQuery =
    useQuery({
      ...currentUserQueryOptions(),

      enabled:
        session.isSettled &&
        session.isAuthenticated &&
        requiresCurrentUser,
    });

  if (!session.isSettled) {
    return {
      status: "checking",

      allowed: false,

      isChecking: true,

      isAuthenticated: false,

      requiresCurrentUser,

      error: null,
    };
  }

  if (!session.isAuthenticated) {
    return {
      status:
        "unauthenticated",

      allowed: false,

      isChecking: false,

      isAuthenticated: false,

      requiresCurrentUser,

      error: null,
    };
  }

  if (!requiresCurrentUser) {
    return {
      status: "allowed",

      allowed: true,

      isChecking: false,

      isAuthenticated: true,

      requiresCurrentUser: false,

      error: null,
    };
  }

  if (
    currentUserQuery.isPending ||
    !currentUserQuery.data
  ) {
    if (currentUserQuery.isError) {
      return {
        status: "error",

        allowed: false,

        isChecking: false,

        isAuthenticated: true,

        requiresCurrentUser: true,

        error:
          currentUserQuery.error,
      };
    }

    return {
      status: "checking",

      allowed: false,

      isChecking: true,

      isAuthenticated: true,

      requiresCurrentUser: true,

      error: null,
    };
  }

  const allowed =
    evaluateRouteAccess(
      currentUserQuery.data,
      requirement,
    );

  return {
    status:
      allowed
        ? "allowed"
        : "forbidden",

    allowed,

    isChecking: false,

    isAuthenticated: true,

    requiresCurrentUser: true,

    error: null,
  };
}
