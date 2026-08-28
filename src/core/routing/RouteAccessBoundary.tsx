import type {
  ReactNode,
} from "react";

import {
  useRouteAccess,
} from "./route-access.hooks";

import type {
  RouteAccessRequirement,
} from "./routing.types";

export interface RouteAccessBoundaryProps {
  children:
    ReactNode;

  requirement?:
    RouteAccessRequirement;

  checkingFallback?:
    ReactNode;

  unauthenticatedFallback?:
    ReactNode;

  forbiddenFallback?:
    ReactNode;

  errorFallback?:
    ReactNode;
}

export function RouteAccessBoundary({
  children,
  requirement,
  checkingFallback = null,
  unauthenticatedFallback = null,
  forbiddenFallback = null,
  errorFallback = null,
}: RouteAccessBoundaryProps) {
  const access =
    useRouteAccess(
      requirement,
    );

  switch (access.status) {
    case "allowed":
      return children;

    case "checking":
      return checkingFallback;

    case "unauthenticated":
      return unauthenticatedFallback;

    case "forbidden":
      return forbiddenFallback;

    case "error":
      return errorFallback;
  }
}
