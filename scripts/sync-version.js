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
  const manifestPath = path.join(__dirname, '../public/manifest.json');

  try {
    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;

    // Read manifest.json
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    // Update version
    manifest.version = version;

    // Write back
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

    console.log(`✅ Version synced: ${version}`);
    console.log(`   • Source: package.json`);
    console.log(`   • Updated: public/manifest.json`);
  } catch (error) {
    console.error('❌ Error syncing version:', error.message);
    process.exit(1);
  }
}

main();
