/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",

  testMatch: [
    "<rootDir>/tests/**/*.test.ts",
    "<rootDir>/tests/**/*.test.tsx",
  ],

  moduleNameMapper: {
    "^@/(.*)$":
      "<rootDir>/src/$1",
  },

  clearMocks: true,

  coverageDirectory:
    "<rootDir>/coverage",

  collectCoverageFrom: [
    "src/core/**/*.{ts,tsx}",
    "!src/core/**/index.ts",
    "!src/core/**/*.types.ts",
  ],
};
