#!/usr/bin/env node

/**
 * Sync version from package.json to manifest.json
 * Single source of truth: package.json
 * Run: node scripts/sync-version.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const manifestPaths = [
    path.join(__dirname, '../public/manifest-chrome.json'),
    path.join(__dirname, '../public/manifest-firefox.json'),
  ];

  try {
    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;

    // Update both manifest files
    for (const manifestPath of manifestPaths) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      manifest.version = version;
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    }

    console.log(`✅ Version synced: ${version}`);
    console.log(`   • Source: package.json`);
    console.log(`   • Updated: public/manifest-chrome.json`);
    console.log(`   • Updated: public/manifest-firefox.json`);
  } catch (error) {
    console.error('❌ Error syncing version:', error.message);
    process.exit(1);
  }
}

main();
