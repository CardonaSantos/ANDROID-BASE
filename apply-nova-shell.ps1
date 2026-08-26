$ErrorActionPreference = "Stop"

Write-Host "Applying NOVA app shell..."

$source = Split-Path -Parent $MyInvocation.MyCommand.Path
$project = Get-Location

Copy-Item "$source\index.ts" "$project\index.ts" -Force
Copy-Item "$source\src\app\_layout.tsx" "$project\src\app\_layout.tsx" -Force
Copy-Item "$source\src\app\index.tsx" "$project\src\app\index.tsx" -Force

$remove = @(
  "$project\src\app\explore.tsx",
  "$project\src\components",
  "$project\src\constants",
  "$project\src\hooks"
)

foreach ($path in $remove) {
  if (Test-Path $path) {
    Remove-Item $path -Recurse -Force
    Write-Host "Removed: $path"
  }
}

$expoCache = "$project\.expo"
if (Test-Path $expoCache) {
  Remove-Item $expoCache -Recurse -Force
  Write-Host "Removed stale Expo typed-route cache: $expoCache"
}

Write-Host ""
Write-Host "NOVA shell applied."
Write-Host "Run:"
Write-Host "  npx tsc --noEmit"
Write-Host "  npm run lint"
Write-Host "  npx expo start --clear"
