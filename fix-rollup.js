const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fixRollupDependency() {
  try {
    // Create symlinks for rollup on Linux
    const rollupDir = path.join(__dirname, 'node_modules', '@rollup');
    if (!fs.existsSync(rollupDir)) {
      fs.mkdirSync(rollupDir, { recursive: true });
    }

    const rollupTarget = path.join(__dirname, 'node_modules', 'rollup');
    const rollupLink = path.join(rollupDir, 'rollup-linux-x64-gnu');

    // Create symlink if rollup exists
    if (fs.existsSync(rollupTarget) && !fs.existsSync(rollupLink)) {
      if (process.platform === 'win32') {
        fs.symlinkSync(rollupTarget, rollupLink, 'junction');
      } else {
        fs.symlinkSync(rollupTarget, rollupLink);
      }
    }

    // Clean and reinstall if needed
    if (!fs.existsSync(path.join(__dirname, 'node_modules', 'rollup'))) {
      console.log('Cleaning installation...');
      try {
        fs.rmSync('node_modules', { recursive: true, force: true });
        fs.rmSync('package-lock.json', { force: true });
      } catch (e) {
        // Ignore errors if files don't exist
      }

      console.log('Installing dependencies...');
      execSync('npm install --no-optional', { stdio: 'inherit' });
    }

    console.log('Rollup dependency fix applied successfully!');
  } catch (error) {
    console.error('Error fixing rollup dependency:', error);
    process.exit(1);
  }
}

fixRollupDependency();
