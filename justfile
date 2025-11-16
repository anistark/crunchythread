# CrunchyThread Build Commands

set shell := ["bash", "-c"]
set dotenv-load := false

# List all available commands
help:
    @just --list

# Install dependencies
install:
    pnpm install

# Production build
build: clean install
    pnpm build

# Format code with Prettier
format:
    pnpm prettier --write "src/**/*.{ts,tsx,css,json}"

# Lint code with ESLint
lint:
    pnpm eslint src --ext .ts,.tsx --max-warnings=0

# Lint and fix issues
lint-fix:
    pnpm eslint src --ext .ts,.tsx --fix

# Type check with TypeScript
type-check:
    pnpm tsc --noEmit

# Clean build artifacts and generated files
clean:
    rm -rf dist node_modules .pnpm-store src/config/anime-mappings.ts

# Package extension for deployment
package: build
    @echo "Creating deployment package..."
    @cd dist && zip -r ../crunchythread-build.zip . && cd ..
    @echo "✓ Extension packaged: crunchythread-build.zip"

# Run all checks (lint, type, format check)
check: lint type-check
    @pnpm prettier --check "src/**/*.{ts,tsx,css,json}"
    @echo "✓ All checks passed"

# Deploy to Chrome Web Store (requires credentials)
deploy: build
    @echo "Ready for Chrome Web Store deployment"
    @echo "Manual step: Upload dist/ directory or crunchythread-build.zip to Chrome Web Store"
    @ls -lah dist/

# Watch and rebuild on changes (without HMR)
watch:
    pnpm vite build --watch

# Create a new release tag from package.json version
release:
    #!/bin/bash
    VERSION=$(jq -r '.version' package.json)
    TAG="v$VERSION"
    if git rev-parse "$TAG" >/dev/null 2>&1; then
        echo "❌ Tag $TAG already exists"
        exit 1
    fi
    git tag -a "$TAG" -m "Release $TAG"
    echo "✓ Created tag: $TAG"
    echo "Push with: git push origin $TAG"
