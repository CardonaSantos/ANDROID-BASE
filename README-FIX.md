# NOVA App Shell v1.1 — Unistyles Web/SSR bootstrap fix

## Symptom

Expo Web fails at runtime with:

```text
Unistyles: One of your stylesheets is trying to get the theme,
but no theme has been selected yet.
```

while TypeScript reports no errors.

## Cause

Expo Router's Web renderer can load `src/app/_layout.tsx` directly through the
router server. In that execution path, the project's custom `index.ts` is not a
safe place to assume Unistyles has already been configured.

`_layout.tsx` imports the public Design System barrel, which reexports many
modules containing themed `StyleSheet.create(...)` calls. Those modules must
not evaluate before `StyleSheet.configure(...)`.

## Fix

A canonical side-effect bootstrap is added:

```text
src/design-system/bootstrap.ts
```

It initializes:

```text
theme/unistyles
theme/theme-controller
```

The bootstrap is imported from all three relevant boundaries:

```text
root index.ts
src/app/_layout.tsx
src/design-system/index.ts
```

The public barrel importing the bootstrap makes isolated imports from
`@/design-system` safe even outside the standard application entry flow.

## Apply

Replace/add:

```text
index.ts
src/app/_layout.tsx
src/design-system/bootstrap.ts
src/design-system/index.ts
```

Then clear Expo/Metro state:

```powershell
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
npx expo start --clear
```

Then verify:

```bash
npx tsc --noEmit
npm run lint
```
