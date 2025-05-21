
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
  ln -sf "$(pwd)/node_modules/rollup" "$(pwd)/node_modules/@rollup/rollup-linux-x64-gnu" || true
fi

echo "Running build..."
npm run build

echo "Build completed successfully!"
npm install --production=false

echo "Running dependency fixes..."
node fix-dependencies.js

echo "Building application..."
npm run build

echo "Starting the server..."
node server.cjs
