# ANDROID-BASE — Testing Phase 1

This first phase validates the Jest/Expo test runner and starts the regression
suite with Core logic that does not depend on native UI rendering.

## Versions / tooling decision

Use Expo's supported testing stack:

- Jest
- `jest-expo`
- Jest preset managed by Expo

Do not install Jest arbitrarily at a version that differs from the one selected
by Expo. Install the compatible pair through `expo install`.

For React Native component/integration tests we will add
`@testing-library/react-native` in Phase 2. Expo's current documentation
recommends it and explicitly warns against the deprecated React 19
`react-test-renderer` workflow.

## 1. Install the test runner

From the project root:

```bash
npx expo install jest-expo jest -- --save-dev
npm install --save-dev @types/jest@30.0.0
```

## 2. Add npm scripts

Run:

```bash
npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:core="jest tests/core"
npm pkg set scripts.test:coverage="jest --coverage"
```

## 3. Copy this package over the project root

This adds:

```text
jest.config.js
tests/
  core/
    access/
    routing/
    realtime/
```

Do NOT put tests inside `src/app`. Expo Router treats files inside the app
directory as routes/layouts.

## 4. Run the regression suite

```bash
npx tsc --noEmit
npm run lint
npm run test:core -- --runInBand
```

Expected initial suite:

- 10 Access tests
- 10 Routing tests
- 5 Realtime runtime tests
- 25 tests total

## 5. Then run all tests

```bash
npm test -- --runInBand
```

## What Phase 1 verifies

### Access
- exact role/permission checks
- any/all semantics
- null user = denied
- empty requirements = denied

### Routing
- CurrentUser requirement detection
- default `all` semantics
- explicit `any` semantics
- roles + permissions use AND semantics
- empty requirements fail closed

### Realtime feature runtime
- one shared lifecycle for multiple consumers
- idempotent release
- reverse teardown ordering
- startup rollback on partial failure

## Next phase

After these 25 tests are green, Phase 2 adds the high-value integration tests:

- Auth refresh single-flight
- stale refresh cannot overwrite a newer session
- stale 401 cannot clear a newer session
- HTTP late-401 behavior
- exactly one HTTP retry
- CurrentUser query/hooks
- RouteAccessBoundary
- Expo Router protected-route integration

Then we move to device/browser smoke testing and finally Maestro E2E.
