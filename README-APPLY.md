# NOVA App Shell + Showcase

This patch replaces the active Expo starter UI with the NOVA Design System.

## Files replaced

```text
index.ts
src/app/_layout.tsx
src/app/index.tsx
```

## Legacy template paths removed

```text
src/app/explore.tsx
src/components/
src/constants/
src/hooks/
```

Assets and `src/global.css` are deliberately left untouched for now.

After removing `explore.tsx`, also delete the local `.expo/` directory once so
Expo Router regenerates typed routes from the new single-route shell.

## Apply manually

Copy the three replacement files into the project, then remove the legacy
paths listed above.

## Apply automatically on Windows PowerShell

Extract this ZIP outside the project, open PowerShell at the project root and
run:

```powershell
& "PATH\TO\nova-app-shell-showcase\apply-nova-shell.ps1"
```

## Validate

```bash
npx tsc --noEmit
npm run lint
npx expo start --clear
```

## Architecture

The root now mounts:

```text
AppDesignSystemProvider
└── Expo Router Stack
    └── /
        └── NOVA showcase
```

The showcase intentionally contains no business logic and no hardcoded colors
or backgrounds. It exists only to exercise the reusable NOVA baseline until
real application routes replace it.
