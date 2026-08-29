import { describe, expect, test } from "@jest/globals";

import { readFileSync } from "node:fs";

import { resolve } from "node:path";

describe("tracking safe logout wiring", () => {
  test("backend bootstrap conecta tracking con el logout", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/application/backend/bootstrap.ts"),
      "utf8",
    );

    /*
     * Comprobamos que ambos elementos
     * existen en el composition root.
     */
    expect(source).toContain("configureBeforeLogoutHandler");

    expect(source).toContain("prepareTrackingForLogout");

    /*
     * No dependemos del formato aplicado
     * por Prettier/ESLint/editor.
     *
     * Son equivalentes:
     *
     * configureBeforeLogoutHandler(
     *   prepareTrackingForLogout,
     * );
     *
     * configureBeforeLogoutHandler(prepareTrackingForLogout);
     */
    expect(source).toMatch(
      /configureBeforeLogoutHandler\s*\(\s*prepareTrackingForLogout\s*,?\s*\)\s*;/,
    );
  });
});
