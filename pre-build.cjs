
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Check if fix-rollup.js exists, and if it does, rename it to fix-rollup.cjs
  const rollupJsPath = path.join(__dirname, 'fix-rollup.js');
  const rollupCjsPath = path.join(__dirname, 'fix-rollup.cjs');
  
  if (fs.existsSync(rollupJsPath) && !fs.existsSync(rollupCjsPath)) {
    console.log('Renaming fix-rollup.js to fix-rollup.cjs...');
    fs.copyFileSync(rollupJsPath, rollupCjsPath);
  }
  
  // Run the fix-package script first
  console.log('Running package.json fix script...');
  require('./fix-package.cjs');
  
  // Now run the original build command
  console.log('Continuing with build process...');
} catch (error) {
  console.error('Error in pre-build script:', error);
  process.exit(1);
}
