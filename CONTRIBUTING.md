# 🤝 Contributing to CrunchyThread

Thank you for your interest in contributing! We welcome all kinds of contributions:

- 🐛 Bug reports and fixes
- ✨ Feature requests and implementations
- 📖 Documentation improvements
- 📝 Adding missing anime to the database
- 🎨 UI/UX improvements

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (recommend 20+)
- **pnpm** 10+ (`npm install -g pnpm`)
- **Git**
- A code editor (VSCode recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # On GitHub, click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/crunchythread.git
   cd crunchythread
   ```

3. **Add upstream remote** (to keep in sync)
   ```bash
   git remote add upstream https://github.com/anistark/crunchythread.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Build the extension**
   ```bash
   just build
   ```

6. **Load extension in Chrome**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist/` folder

---

## 📝 Making Changes

### Branch Naming
Use descriptive branch names:
```bash
git checkout -b feature/anime-search-improvement
git checkout -b fix/oauth-token-expiry
git checkout -b docs/update-readme
```

### Code Style
We use automated formatting:

```bash
# Format code
pnpm format

# Check for linting issues
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Type check
pnpm type-check
```

All checks **must pass** before submitting a PR.

### Commit Messages
Use clear, descriptive commit messages:
```
✨ Add fuzzy matching for anime titles
🐛 Fix OAuth token refresh issue
📝 Update CONTRIBUTING guide
♻️ Refactor thread search logic
```

Prefixes:
- `✨` — New feature
- `🐛` — Bug fix
- `📝` — Documentation
- `♻️` — Refactoring
- `⚡` — Performance improvement
- `🎨` — UI/UX
- `🧪` — Tests

### Pull Request Process

1. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Compare your fork's branch with `anistark/crunchythread:main`
   - Provide a clear title and description
   - Link any related issues (e.g., "Fixes #123")

4. **Wait for review**
   - Maintainers will review your PR
   - Address feedback and update your PR
   - All CI checks must pass

---

## 🎯 Common Contribution Types

### Adding Anime to Database

The easiest way to contribute! Help us grow the anime database.

1. **Edit the mapping file**
   ```
   data/ANIMESUBREDDITS.yaml
   ```

2. **Add your anime** (keep alphabetical order)
   ```yaml
   - title: "Attack on Titan"
     subreddits: ["attackontitan"]
     aliases: ["AOT", "Shingeki no Kyojin"]
     season_specific: false
   ```

3. **Rebuild the extension**
   ```bash
   just build
   ```
   This auto-generates the TypeScript from your YAML changes.

4. **Test locally**
   - Reload the extension in `chrome://extensions/`
   - Open a Crunchyroll episode page to test

5. **Submit PR**
   - Clear title: "Add Attack on Titan to anime database"
   - Only modify `data/ANIMESUBREDDITS.yaml` in this PR

### Reporting Bugs

1. **Check if bug is already reported**
   - Search [GitHub Issues](https://github.com/anistark/crunchythread/issues)

2. **Create a detailed bug report**
   ```markdown
   ## Description
   Brief description of the bug

   ## Steps to Reproduce
   1. Open Crunchyroll
   2. Click extension icon
   3. See error

   ## Expected Behavior
   What should happen

   ## Actual Behavior
   What actually happens

   ## Environment
   - Browser: Chrome 120
   - OS: macOS 14
   - Extension Version: 0.1.0

   ## Screenshots
   (if applicable)
   ```

3. **Provide context**
   - Is this consistent or random?
   - Does it happen in developer mode?
   - What anime did you test with?

### Proposing Features

1. **Start a discussion** instead of opening an issue
   - Go to [GitHub Discussions](https://github.com/anistark/crunchythread/discussions)
   - Create a "Feature Request"

2. **Describe your feature**
   - What problem does it solve?
   - How would users interact with it?
   - Any design mockups?

3. **Get feedback**
   - Maintainers will discuss feasibility
   - Refine the feature together
   - Open PR when ready

---

## 🧪 Testing Your Changes

### Manual Testing

**Step 1: Build the extension**
```bash
just build
```

**Step 2: Load extension in Chrome**
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project

**Step 3: Test on Crunchyroll**
1. Go to any Crunchyroll anime episode page (e.g., https://www.crunchyroll.com/watch/...)
2. Click the CrunchyThread extension icon in your Chrome toolbar
3. The popup should:
   - Show "Currently watching: [Anime Title]" if detection works
   - Show "Episode [number]" if episode was detected
   - Display "Discussion Threads:" with Reddit results if search works
4. Check the browser console (F12 → Console tab) for CrunchyThread debug logs

**Step 4: Enable debug logs (optional)**
Debug logging is **commented out** by default but easy to enable for development:
1. Open `src/popup/App.tsx`, `src/content/crunchyroll-detector.ts`, or `src/background/service-worker.ts`
2. Uncomment the `debugLog()`, `debugWarn()`, and `debugError()` function calls throughout the file
3. Rebuild: `pnpm build`

**Step 5: Check debug logs**
If the extension isn't working:
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for logs starting with `[🧵 CrunchyThread]`
4. These will show:
   - Whether content script loaded
   - What anime data was detected
   - Whether message communication succeeded
   - Reddit search results and scoring

**Step 6: Test Reddit search**
1. Check background service worker logs:
   - Go to `chrome://extensions/`
   - Find CrunchyThread
   - Click "service worker" link
   - Check console for search results

**Note:** Hard refresh Chrome after making code changes to ensure new build is loaded.

### Code Quality Checks
```bash
# Individual checks
pnpm lint          # ESLint
pnpm format:check  # Prettier
pnpm type-check    # TypeScript
```

### Testing Across Browsers/Regions
- Test on Crunchyroll US, EU (if available)
- Test with different anime
- Test on different episode pages
- Test login/logout flow

---

## 📚 Project Structure

See [DEV.md](./DEV.md) for detailed project structure, architecture, and technical decisions.

Quick reference:
- `src/popup/` — User-facing React UI
- `src/content/` — Crunchyroll anime detection
- `src/background/` — Reddit API calls (anonymous)
- `data/ANIMESUBREDDITS.yaml` — Anime-to-subreddit mapping (source of truth)
- `scripts/generate-anime-mappings.js` — Build script (auto-generates TypeScript)

---

## 🔍 Code Review Guidelines

When reviewing code, we look for:

✅ **Do**
- Follow project coding style
- Add TypeScript types
- Handle error cases gracefully
- Keep components small and focused
- Write comments for complex logic
- Test your changes thoroughly

❌ **Don't**
- Mix features in one PR (keep focused)
- Add console.logs (use error handling)
- Ignore TypeScript errors
- Break existing functionality
- Commit sensitive data (API keys, tokens)

---

## 📖 Documentation

### Code Documentation
- Use TypeScript types for self-documentation
- Add JSDoc comments for public functions:
  ```typescript
  /**
   * Searches Reddit for anime discussion threads
   * @param query - The search query (e.g., "Jujutsu Kaisen Episode 5")
   * @returns Promise<RedditThread[]> - Matching threads
   */
  async function searchThreads(query: string): Promise<RedditThread[]> {
    // implementation
  }
  ```

### Documentation Files
- **README.md** — User-facing: installation, features, FAQ, support
- **CONTRIBUTING.md** — This file: developer setup, workflow, how to contribute
- **DEV.md** — Internal docs: tech stack, architecture, roadmap, project decisions

---

## 🚀 Deployment

Maintainers handle Chrome Web Store deployment. Once your PR is merged:

1. Changes are bundled in next release
2. Version is bumped
3. Release notes are generated
4. Extension is published to Chrome Web Store

---

## 💬 Getting Help

- 📖 **Questions about the project?** → [GitHub Discussions](https://github.com/anistark/crunchythread/discussions)
- 🐛 **Found a bug?** → [GitHub Issues](https://github.com/anistark/crunchythread/issues)
- 💡 **Have an idea?** → [Feature Requests](https://github.com/anistark/crunchythread/discussions/categories/feature-requests)

---

## 📋 Contribution Checklist

Before submitting a PR, make sure:

- [ ] Code follows project style (use `just format`)
- [ ] No linting errors (`just lint` passes)
- [ ] TypeScript types are correct (`just type-check` passes)
- [ ] Changes are tested locally
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the change
- [ ] Related issues are linked
- [ ] No breaking changes (or clearly documented)
- [ ] Documentation is updated if needed

---

## 🎉 You Made It!

Thank you for contributing to CrunchyThread! Your help makes the extension better for everyone.

---

Made with ❤️ by the CrunchyThread community
