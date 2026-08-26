$ErrorActionPreference = "Stop"

$source = Split-Path -Parent $MyInvocation.MyCommand.Path
$project = Get-Location

Write-Host "Applying NOVA Unistyles Web/SSR bootstrap fix..."

Copy-Item "$source\index.ts" "$project\index.ts" -Force

New-Item -ItemType Directory -Force `
  "$project\src\design-system" | Out-Null

Copy-Item `
  "$source\src\design-system\bootstrap.ts" `
  "$project\src\design-system\bootstrap.ts" `
  -Force

Copy-Item `
  "$source\src\design-system\index.ts" `
  "$project\src\design-system\index.ts" `
  -Force

Copy-Item `
  "$source\src\app\_layout.tsx" `
  "$project\src\app\_layout.tsx" `
  -Force

$expoCache = "$project\.expo"

if (Test-Path $expoCache) {
  Remove-Item $expoCache -Recurse -Force
  Write-Host "Removed Expo cache: $expoCache"
}

Write-Host ""
Write-Host "Fix applied."
Write-Host "Now run:"
Write-Host "  npx expo start --clear"
Write-Host "  npx tsc --noEmit"
Write-Host "  npm run lint"
