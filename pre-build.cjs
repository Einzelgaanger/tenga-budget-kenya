
const { execSync } = require('child_process');

try {
  // Run the fix-package script first
  console.log('Running package.json fix script...');
  require('./fix-package.cjs');
  
  // Now run the original build command
  console.log('Continuing with build process...');
} catch (error) {
  console.error('Error in pre-build script:', error);
  process.exit(1);
}
