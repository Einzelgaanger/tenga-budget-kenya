#!/bin/bash

# Exit on error
set -e

echo "Cleaning up previous installation..."
rm -rf node_modules
rm -rf package-lock.json

echo "Installing dependencies..."
npm install --omit=optional

# Fix for rollup issue - create a symlink for the missing module
echo "Fixing rollup dependency issue..."
mkdir -p node_modules/@rollup
cd node_modules/@rollup
if [ ! -d "rollup-linux-x64-gnu" ]; then
  echo "Creating symlink for rollup-linux-x64-gnu"
  ln -s ../rollup rollup-linux-x64-gnu
fi
cd ../..

echo "Building application..."
npm run build

echo "Starting the server..."
node server.js
