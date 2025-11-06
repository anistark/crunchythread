# CrunchyThread

<div align="center">
  <img src="./public/logo.png" alt="CrunchyThread Logo" width="200" />
</div>

> Watch | React | Discuss

**CrunchyThread** is a Chrome extension that connects any **Crunchyroll anime episode** directly to its respective **Reddit discussion thread** — instantly.

Watch → Click → Discuss.
No more hunting for episode threads or missing out on live community reactions.

---

## 🎬 What It Does

When you open an anime or episode page on [Crunchyroll](https://www.crunchyroll.com), CrunchyThread automatically detects the title and episode number, then:

- 🔗 Finds the **matching Reddit discussion thread** (in the anime's subreddit).
- 💬 Shows a **pop-up card** with:
  - Thread title, subreddit, and comment stats (upvotes/comments/time).
  - Button to **open thread** on Reddit.
- 🌙 Fully optimized for **dark theme**, matching Crunchyroll + Reddit aesthetics.

---

## 🧠 Why It Exists

Anime fans love the shared experience — the memes, theories, and emotional breakdowns — that follow every episode drop.

But right now, you have to:
1. Watch an episode
2. Open Reddit
3. Manually search for the right thread

**CrunchyThread** makes this frictionless.
It's your one-click bridge from *watching* to *talking*.

---

## 📥 Installation

### From Chrome Web Store (Coming Soon)
1. Visit Chrome Web Store page (link coming soon)
2. Click "Add to Chrome"
3. Confirm permissions

### Manual Installation (Developer Version)
1. Download the latest release from [GitHub releases](https://github.com/anistark/crunchythread/releases)
2. Extract the `.zip` file
3. Go to `chrome://extensions/`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked"
6. Select the extracted folder

---

## 🚀 Getting Started

### First Time Setup
1. **Install the extension** (see above)
2. Open any Crunchyroll anime episode page
3. Click the **CrunchyThread** icon to see the discussion thread

### Using CrunchyThread
1. Navigate to any Crunchyroll anime episode page
2. The extension **automatically detects** the anime and episode number
3. Click the **CrunchyThread icon** in your browser toolbar
4. See the best matching Reddit discussion thread instantly
5. Click the card to **open the thread on Reddit** in a new tab
6. Join the community discussion!

**That's it!** No login required. The extension searches Reddit anonymously with smart scoring to find the most relevant thread.

---

## 🎨 Features

- ✅ **Instant Thread Discovery** — Automatically finds the matching Reddit discussion thread
- ✅ **Beautiful Glassmorphic Design** — Frosted glass UI with dark theme matching Crunchyroll aesthetics
- ✅ **Smart Thread Matching** — AI-powered scoring prioritizes exact episode matches
- ✅ **Live Status Indicator** — Pulsing green dot shows you're actively watching
- ✅ **Prominent Stats** — Large emoji + numbers show upvotes and comment counts
- ✅ **Anime Detection** — Automatically identifies anime title and episode number
- ✅ **No Login Required** — Anonymous Reddit search, completely privacy-friendly
- ✅ **Fast & Lightweight** — Minimal bundle size, instant popup load
- ✅ **Smooth Animations** — Hover effects and transitions for delightful UX

---

## 🛠️ Troubleshooting

### Extension not detecting anime
- Make sure you're on a Crunchyroll episode page (not the series listing)
- Refresh the page and try again
- Check that the extension is enabled in `chrome://extensions/`

### "No discussion thread found"
- The anime might not have a discussion thread on Reddit yet
- Try creating a new discussion in the anime's subreddit
- Community contributions to the anime mapping help with this!

### Permission denied
- The extension needs access to Crunchyroll and Reddit pages
- Accept the permission prompts when installing

### Search is slow or timing out
- Reddit rate limits anonymous requests (10/minute)
- Wait a moment and try again
- If it persists, Reddit might be experiencing issues

---


## 🤝 Contributing

We welcome contributions! Here are ways you can help:

### Improve Thread Matching
Help us find better subreddits and improve search accuracy:
1. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup
2. Update the subreddit list in `src/background/service-worker.ts`
3. Test different search queries
4. Submit a pull request

### Report Bugs
Found an issue? [Open an issue](https://github.com/anistark/crunchythread/issues) on GitHub with:
- What you were doing
- What went wrong
- Your browser version

### Request Features
Have an idea? [Start a discussion](https://github.com/anistark/crunchythread/discussions) on GitHub.

---

## 📄 License

Licensed under the **MIT License** — see [LICENSE](./LICENSE) file for details.

---

## 🔒 Privacy & Permissions

CrunchyThread requests the following permissions:

- **Read Crunchyroll pages** — To detect anime title and episode number
- **Read Reddit pages** — To search for public discussion threads

We **never**:
- Collect or store your personal data
- Require you to log in or authenticate
- Send data anywhere except Reddit's public API
- Store any information on our servers
- Sell or share any information

---

## ❓ FAQ

**Q: Do I need a Reddit account?**
A: No! CrunchyThread searches Reddit anonymously. No login or account required.

**Q: Is this official?**
A: No, CrunchyThread is an unofficial fan project. It's not affiliated with Crunchyroll or Reddit.

**Q: Does this store my data?**
A: No. The extension only searches public Reddit data using the official Reddit API. We don't collect or store any user information.

**Q: Can I use this on Firefox?**
A: Not yet, but Firefox support is planned for a future release.

**Q: How can I add my favorite anime to the database?**
A: Great question! Check [CONTRIBUTING.md](./CONTRIBUTING.md) for the easy steps.

---

## 📞 Support

- 🐛 **Report bugs**: [GitHub Issues](https://github.com/anistark/crunchythread/issues)
- 💬 **Ask questions**: [GitHub Discussions](https://github.com/anistark/crunchythread/discussions)
- 🎯 **Request features**: [Feature Requests](https://github.com/anistark/crunchythread/discussions/categories/feature-requests)

---

Made with ❤️ for anime fans
