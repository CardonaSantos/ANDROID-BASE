$ErrorActionPreference = "Stop"

$source = Split-Path -Parent $MyInvocation.MyCommand.Path
$project = Get-Location

Write-Host "Applying NOVA Web compatibility hotfix v1.2..."

New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\primitives\AppIcon\AppIcon.tsx" "$project\src\design-system\primitives\AppIcon\AppIcon.tsx" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\primitives\AppIcon\AppIcon.types.ts" "$project\src\design-system\primitives\AppIcon\AppIcon.types.ts" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\feedback-components\AppProgress\AppProgress.tsx" "$project\src\design-system\feedback-components\AppProgress\AppProgress.tsx" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\navigation\AppTopBar\AppTopBar.tsx" "$project\src\design-system\navigation\AppTopBar\AppTopBar.tsx" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\overlays\AppToast\AppToast.tsx" "$project\src\design-system\overlays\AppToast\AppToast.tsx" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\actions\AppSegmentedControl\AppSegmentedControl.tsx" "$project\src\design-system\actions\AppSegmentedControl\AppSegmentedControl.tsx" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\actions\AppButton\AppButton.tsx" "$project\src\design-system\actions\AppButton\AppButton.tsx" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\forms\_internal\AppInputBase\AppInputBase.tsx" "$project\src\design-system\forms\_internal\AppInputBase\AppInputBase.tsx" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\primitives\AppPressable\AppPressable.tsx" "$project\src\design-system\primitives\AppPressable\AppPressable.tsx" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\theme\theme.types.ts" "$project\src\design-system\theme\theme.types.ts" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\theme\light-theme.ts" "$project\src\design-system\theme\light-theme.ts" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\theme\dark-theme.ts" "$project\src\design-system\theme\dark-theme.ts" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\primitives\AppSurface\AppSurface.tsx" "$project\src\design-system\primitives\AppSurface\AppSurface.tsx" -Force
New-Item -ItemType Directory -Force "$project\." | Out-Null
Copy-Item "$source\src\design-system\actions\AppFab\AppFab.tsx" "$project\src\design-system\actions\AppFab\AppFab.tsx" -Force
Copy-Item "$source\.gitattributes" "$project\.gitattributes" -Force

$expoCache = "$project\.expo"
if (Test-Path $expoCache) {
  Remove-Item $expoCache -Recurse -Force
}

Write-Host ""
Write-Host "Hotfix applied."
Write-Host "Run:"
Write-Host "  npx tsc --noEmit"
Write-Host "  npm run lint"
Write-Host "  npx expo start --clear"
