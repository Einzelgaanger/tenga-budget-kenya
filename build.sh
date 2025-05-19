
#!/bin/bash

# Exit on error
set -e

echo "Installing dependencies..."
npm install

echo "Running build..."
npm run build

echo "Starting the server..."
node server.js
