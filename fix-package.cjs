
const fs = require('fs');
const path = require('path');

try {
  console.log('Fixing package.json build script...');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    console.log('Reading package.json...');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Update the build script to use the correct extension
    if (packageJson.scripts && packageJson.scripts.build) {
      console.log('Checking build script...');
      
      // Replace any references to fix-rollup.js with fix-rollup.cjs
      if (packageJson.scripts.build.includes('fix-rollup.js')) {
        console.log('Updating build script to use .cjs extension...');
        packageJson.scripts.build = packageJson.scripts.build.replace('fix-rollup.js', 'fix-rollup.cjs');
        
        // Write back the updated package.json
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('package.json updated successfully.');
      } else {
        console.log('Build script already uses correct extension or has different format.');
      }
    } else {
      console.error('Build script not found in package.json!');
    }
  } else {
    console.error('package.json not found!');
  }
} catch (error) {
  console.error('Error fixing package.json:', error);
}
