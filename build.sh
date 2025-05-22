
#!/bin/bash

# Exit on error
set -e

# Create temp directory for rollup fix
mkdir -p temp_modules/@rollup

echo "Cleaning up previous installation..."
rm -rf node_modules package-lock.json

echo "Installing dependencies..."
npm install --no-optional

echo "Creating rollup symlink..."
if [ -d "node_modules/rollup" ]; then
  echo "Creating rollup symlink..."
  mkdir -p node_modules/@rollup
  ln -sf "$(pwd)/node_modules/rollup" "$(pwd)/node_modules/@rollup/rollup-linux-x64-gnu" || true
  echo "Symlink created"
else
  echo "Rollup directory not found"
fi

echo "Running dependency fixes..."
node fix-dependencies.cjs
node fix-rollup.cjs

echo "Building application..."
npm run build

echo "Starting the server..."
node server.cjs

