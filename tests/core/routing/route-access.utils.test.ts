import {
  describe,
  expect,
  test,
} from "@jest/globals";

import type {
  CurrentUser,
} from "@/core/access";

import {
  evaluateRouteAccess,
  routeRequiresCurrentUser,
} from "@/core/routing";

const user: CurrentUser = {
  id: "user-1",

  roles: [
    "ADMIN",
    "TECHNICIAN",
  ],

  permissions: [
    "tickets.read",
    "tickets.update",
    "customers.read",
  ],
};

describe("route access utils", () => {
  test("a route without access requirements does not require CurrentUser", () => {
    expect(
      routeRequiresCurrentUser(),
    ).toBe(false);

    expect(
      routeRequiresCurrentUser(
        {},
      ),
    ).toBe(false);
  });

  test("roles or permissions make CurrentUser necessary", () => {
    expect(
      routeRequiresCurrentUser({
        roles: ["ADMIN"],
      }),
    ).toBe(true);

    expect(
      routeRequiresCurrentUser({
        permissions: [
          "tickets.read",
        ],
      }),
    ).toBe(true);
  });

  test("explicit empty requirements still require CurrentUser", () => {
    expect(
      routeRequiresCurrentUser({
        roles: [],
      }),
    ).toBe(true);

    expect(
      routeRequiresCurrentUser({
        permissions: [],
      }),
    ).toBe(true);
  });

  test("no authorization requirement allows an authenticated user", () => {
    expect(
      evaluateRouteAccess(
        user,
      ),
    ).toBe(true);
  });

  test("roles use all matching by default", () => {
    expect(
      evaluateRouteAccess(
        user,
        {
          roles: [
            "ADMIN",
            "TECHNICIAN",
          ],
        },
      ),
    ).toBe(true);

    expect(
      evaluateRouteAccess(
        user,
        {
          roles: [
            "ADMIN",
            "SELLER",
          ],
        },
      ),
    ).toBe(false);
  });

  test("roleMatch any allows one matching role", () => {
    expect(
      evaluateRouteAccess(
        user,
        {
          roles: [
            "SELLER",
            "TECHNICIAN",
          ],

          roleMatch:
            "any",
        },
      ),
    ).toBe(true);
  });

  test("permissions use all matching by default", () => {
    expect(
      evaluateRouteAccess(
        user,
        {
          permissions: [
            "tickets.read",
            "tickets.update",
          ],
        },
      ),
    ).toBe(true);

    expect(
      evaluateRouteAccess(
        user,
        {
          permissions: [
            "tickets.read",
            "tickets.delete",
          ],
        },
      ),
    ).toBe(false);
  });

  test("permissionMatch any allows one matching permission", () => {
    expect(
      evaluateRouteAccess(
        user,
        {
          permissions: [
            "tickets.delete",
            "customers.read",
          ],

          permissionMatch:
            "any",
        },
      ),
    ).toBe(true);
  });

  test("roles and permissions combine with AND semantics", () => {
    expect(
      evaluateRouteAccess(
        user,
        {
          roles: [
            "ADMIN",
          ],

          permissions: [
            "tickets.read",
          ],
        },
      ),
    ).toBe(true);

    expect(
      evaluateRouteAccess(
        user,
        {
          roles: [
            "ADMIN",
          ],

          permissions: [
            "tickets.delete",
          ],
        },
      ),
    ).toBe(false);
  });

  test("explicit empty requirements fail closed", () => {
    expect(
      evaluateRouteAccess(
        user,
        {
          roles: [],
        },
      ),
    ).toBe(false);

    expect(
      evaluateRouteAccess(
        user,
        {
          permissions: [],
        },
      ),
    ).toBe(false);
  });
});
