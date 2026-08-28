import {
  describe,
  expect,
  test,
} from "@jest/globals";

import {
  hasAllPermissions,
  hasAllRoles,
  hasAnyPermission,
  hasAnyRole,
  hasPermission,
  hasRole,
} from "@/core/access";

import type {
  CurrentUser,
} from "@/core/access";

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

describe("access utils", () => {
  test("hasRole matches an assigned role", () => {
    expect(
      hasRole(
        user,
        "ADMIN",
      ),
    ).toBe(true);

    expect(
      hasRole(
        user,
        "SELLER",
      ),
    ).toBe(false);
  });

  test("role checks fail closed without a user", () => {
    expect(
      hasRole(
        null,
        "ADMIN",
      ),
    ).toBe(false);

    expect(
      hasAnyRole(
        undefined,
        ["ADMIN"],
      ),
    ).toBe(false);

    expect(
      hasAllRoles(
        null,
        ["ADMIN"],
      ),
    ).toBe(false);
  });

  test("hasAnyRole accepts at least one matching role", () => {
    expect(
      hasAnyRole(
        user,
        [
          "SELLER",
          "TECHNICIAN",
        ],
      ),
    ).toBe(true);

    expect(
      hasAnyRole(
        user,
        [
          "SELLER",
          "AUDITOR",
        ],
      ),
    ).toBe(false);
  });

  test("hasAllRoles requires every role", () => {
    expect(
      hasAllRoles(
        user,
        [
          "ADMIN",
          "TECHNICIAN",
        ],
      ),
    ).toBe(true);

    expect(
      hasAllRoles(
        user,
        [
          "ADMIN",
          "SELLER",
        ],
      ),
    ).toBe(false);
  });

  test("empty role requirements fail closed", () => {
    expect(
      hasAnyRole(
        user,
        [],
      ),
    ).toBe(false);

    expect(
      hasAllRoles(
        user,
        [],
      ),
    ).toBe(false);
  });

  test("hasPermission matches an assigned permission", () => {
    expect(
      hasPermission(
        user,
        "tickets.read",
      ),
    ).toBe(true);

    expect(
      hasPermission(
        user,
        "tickets.delete",
      ),
    ).toBe(false);
  });

  test("permission checks fail closed without a user", () => {
    expect(
      hasPermission(
        null,
        "tickets.read",
      ),
    ).toBe(false);

    expect(
      hasAnyPermission(
        undefined,
        [
          "tickets.read",
        ],
      ),
    ).toBe(false);

    expect(
      hasAllPermissions(
        null,
        [
          "tickets.read",
        ],
      ),
    ).toBe(false);
  });

  test("hasAnyPermission accepts at least one permission", () => {
    expect(
      hasAnyPermission(
        user,
        [
          "tickets.delete",
          "customers.read",
        ],
      ),
    ).toBe(true);

    expect(
      hasAnyPermission(
        user,
        [
          "tickets.delete",
          "customers.delete",
        ],
      ),
    ).toBe(false);
  });

  test("hasAllPermissions requires every permission", () => {
    expect(
      hasAllPermissions(
        user,
        [
          "tickets.read",
          "tickets.update",
        ],
      ),
    ).toBe(true);

    expect(
      hasAllPermissions(
        user,
        [
          "tickets.read",
          "tickets.delete",
        ],
      ),
    ).toBe(false);
  });

  test("empty permission requirements fail closed", () => {
    expect(
      hasAnyPermission(
        user,
        [],
      ),
    ).toBe(false);

    expect(
      hasAllPermissions(
        user,
        [],
      ),
    ).toBe(false);
  });
});
