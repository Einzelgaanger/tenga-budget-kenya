# Exit on error
$ErrorActionPreference = "Stop"

Write-Host "Cleaning up previous installation..."
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

Write-Host "Installing dependencies..."
npm install

Write-Host "Building application..."
npm run build

Write-Host "Build completed successfully!"
