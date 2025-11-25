# CrunchyThread Build Commands

set shell := ["bash", "-c"]
set dotenv-load := false

# List all available commands
help:
    @just --list

# Install dependencies
install:
    pnpm install

# Production build for Chrome and Firefox (or specific browser)
build browser='both': clean install
    @if [ "{{browser}}" = "chrome" ]; then \
        pnpm build:chrome; \
    elif [ "{{browser}}" = "firefox" ]; then \
        pnpm build:firefox; \
    elif [ "{{browser}}" = "both" ]; then \
        pnpm build; \
    else \
        echo "Invalid browser. Use: chrome, firefox, or both"; \
        exit 1; \
    fi

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

# Package extension for deployment (Chrome and Firefox, or specific browser)
package browser='both':
    @if [ "{{browser}}" = "chrome" ]; then \
        just build chrome && \
        echo "Creating deployment package for Chrome..." && \
        mkdir -p dist-chrome && \
        cp -r dist/* dist-chrome/ && \
        cd dist-chrome && zip -r ../crunchythread-chrome.zip . && cd .. && \
        rm -rf dist-chrome && \
        echo "✓ Extension packaged: crunchythread-chrome.zip"; \
    elif [ "{{browser}}" = "firefox" ]; then \
        just build firefox && \
        echo "Creating deployment package for Firefox..." && \
        mkdir -p dist-firefox && \
        cp -r dist/* dist-firefox/ && \
        cd dist-firefox && zip -r ../crunchythread-firefox.zip . && cd .. && \
        rm -rf dist-firefox && \
        echo "✓ Extension packaged: crunchythread-firefox.zip"; \
    elif [ "{{browser}}" = "both" ]; then \
        just build chrome && \
        echo "Creating deployment package for Chrome..." && \
        mkdir -p dist-chrome && \
        cp -r dist/* dist-chrome/ && \
        cd dist-chrome && zip -r ../crunchythread-chrome.zip . && cd .. && \
        rm -rf dist-chrome && \
        echo "✓ Extension packaged: crunchythread-chrome.zip" && \
        just build firefox && \
        echo "Creating deployment package for Firefox..." && \
        mkdir -p dist-firefox && \
        cp -r dist/* dist-firefox/ && \
        cd dist-firefox && zip -r ../crunchythread-firefox.zip . && cd .. && \
        rm -rf dist-firefox && \
        echo "✓ Extension packaged: crunchythread-firefox.zip"; \
    else \
        echo "Invalid browser. Use: chrome, firefox, or both"; \
        exit 1; \
    fi

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
