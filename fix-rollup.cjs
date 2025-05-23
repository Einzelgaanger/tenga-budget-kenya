
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fixRollupDependency() {
  try {
    console.log('Starting rollup dependency fix...');
    
    // Create symlinks for rollup on Linux
    const rollupDir = path.join(__dirname, 'node_modules', '@rollup');
    if (!fs.existsSync(rollupDir)) {
      console.log('Creating @rollup directory...');
      fs.mkdirSync(rollupDir, { recursive: true });
    }

    const rollupTarget = path.join(__dirname, 'node_modules', 'rollup');
    const rollupLink = path.join(rollupDir, 'rollup-linux-x64-gnu');

    // Create symlink if rollup exists
    if (fs.existsSync(rollupTarget) && !fs.existsSync(rollupLink)) {
      console.log('Creating symlink for rollup...');
      if (process.platform === 'win32') {
        fs.symlinkSync(rollupTarget, rollupLink, 'junction');
      } else {
        fs.symlinkSync(rollupTarget, rollupLink);
      }
      console.log('Symlink created successfully');
    } else {
      console.log('Rollup target exists:', fs.existsSync(rollupTarget));
      console.log('Rollup link exists:', fs.existsSync(rollupLink));
    }

    console.log('Rollup dependency fix applied successfully!');
  } catch (error) {
    console.error('Error fixing rollup dependency:', error);
    process.exit(1);
  }
}

fixRollupDependency();
