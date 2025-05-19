#!/bin/bash

# Exit on error
set -e

echo "Installing dependencies..."
npm install

echo "Running TypeScript compilation..."
npm run build

echo "Starting the server..."
npm run start
