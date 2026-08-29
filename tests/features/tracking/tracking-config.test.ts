import { describe, expect, test } from "@jest/globals";

import { readFileSync } from "node:fs";

import { resolve } from "node:path";

describe("tracking native configuration", () => {
  test("expo-location habilita background y foreground service Android", () => {
    const appJsonPath = resolve(process.cwd(), "app.json");

    const appJson = JSON.parse(readFileSync(appJsonPath, "utf8"));

    const locationPlugin = appJson.expo.plugins.find(
      (plugin: unknown) =>
        Array.isArray(plugin) && plugin[0] === "expo-location",
    );

    expect(locationPlugin).toBeDefined();

    expect(locationPlugin[1]).toEqual(
      expect.objectContaining({
        isAndroidBackgroundLocationEnabled: true,

        isAndroidForegroundServiceEnabled: true,
      }),
    );
  });

  test("tracking se registra antes de expo-router", () => {
    const entry = readFileSync(resolve(process.cwd(), "index.ts"), "utf8");

    const trackingIndex = entry.indexOf("./src/application/tracking/bootstrap");

    const routerIndex = entry.indexOf("expo-router/entry");

    expect(trackingIndex).toBeGreaterThanOrEqual(0);

    expect(routerIndex).toBeGreaterThanOrEqual(0);

    expect(trackingIndex).toBeLessThan(routerIndex);
  });

  test("bootstrap importa la background task", () => {
    const bootstrap = readFileSync(
      resolve(process.cwd(), "src/application/tracking/bootstrap.ts"),
      "utf8",
    );

    expect(bootstrap).toContain("@/features/tracking/background/tracking-task");
  });
});
