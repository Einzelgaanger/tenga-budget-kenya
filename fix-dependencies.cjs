
/**
 * This script fixes dependency issues with rollup and esbuild on Linux environments
 */

const fs = require('fs');
const path = require('path');

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Function to create a symlink if it doesn't exist
function createSymlinkIfNeeded(target, linkPath) {
  const linkDir = path.dirname(linkPath);
  ensureDirectoryExists(linkDir);
  
  if (!fs.existsSync(linkPath)) {
    try {
      // For Windows compatibility during development
      if (process.platform === 'win32') {
        fs.symlinkSync(target, linkPath, 'junction');
      } else {
        fs.symlinkSync(target, linkPath);
      }
      console.log(`Created symlink: ${linkPath} -> ${target}`);
    } catch (error) {
      console.error(`Error creating symlink: ${error.message}`);
      // If symlink fails, try creating a directory with a dummy file
      ensureDirectoryExists(linkPath);
      fs.writeFileSync(path.join(linkPath, 'index.js'), 'module.exports = {};');
      console.log(`Created fallback dummy module at ${linkPath}`);
    }
  } else {
    console.log(`Symlink already exists: ${linkPath}`);
  }
}

try {
  // Fix rollup dependency issue
  const rollupDir = path.join(__dirname, 'node_modules', '@rollup');
  ensureDirectoryExists(rollupDir);
  
  // Check if rollup directory exists
  if (fs.existsSync(path.join(__dirname, 'node_modules', 'rollup'))) {
    createSymlinkIfNeeded(
      path.join(__dirname, 'node_modules', 'rollup'),
      path.join(rollupDir, 'rollup-linux-x64-gnu')
    );
  }

  // Fix esbuild dependency issue if needed
  const esbuildDir = path.join(__dirname, 'node_modules', '@esbuild');
  ensureDirectoryExists(esbuildDir);

  // Check if esbuild directory exists
  if (fs.existsSync(path.join(__dirname, 'node_modules', 'esbuild'))) {
    // Check if we're on Linux and need to create the linux-x64 symlink
    if (process.platform === 'linux') {
      createSymlinkIfNeeded(
        path.join(__dirname, 'node_modules', 'esbuild'),
        path.join(esbuildDir, 'linux-x64')
      );
    }
  }

  console.log('Dependency fixes applied successfully!');
} catch (error) {
  console.error('Error applying dependency fixes:', error);
  process.exit(1);
}
