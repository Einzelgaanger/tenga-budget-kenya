
#!/bin/bash

# Exit on error
set -e

echo "Cleaning up previous installation..."
rm -rf node_modules
rm -rf package-lock.json

echo "Installing dependencies..."
npm install --production=false

echo "Building application..."
npm run build

echo "Starting the server..."
node server.js
