# CrunchyThread

<div align="center">
  <img src="./public/logo.png" alt="CrunchyThread Logo" width="200" />
</div>

> Watch | React | Discuss
> 
> No more hunting for episode threads or missing out on live community reactions.

[![Follow on X](https://img.shields.io/badge/Follow%20on%20X-%23000000.svg?style=for-the-badge&logo=X&logoColor=white)](https://x.com/crunchythread)

Supports:

![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white) ![Arc](https://img.shields.io/badge/Arc-000000?style=for-the-badge&logo=arc&logoColor=white) ![Brave](https://img.shields.io/badge/Brave-FB542B?style=for-the-badge&logo=Brave&logoColor=white) ![Opera](https://img.shields.io/badge/Opera-FF1B2D?style=for-the-badge&logo=Opera&logoColor=white) ![Vivaldi](https://img.shields.io/badge/Vivaldi-EF3939?style=for-the-badge&logo=Vivaldi&logoColor=white)

**CrunchyThread** is a Chrome extension that connects any **Crunchyroll anime episode** directly to its respective **Reddit discussion thread** — instantly.

When you open an anime or episode page on [Crunchyroll](https://www.crunchyroll.com), CrunchyThread automatically detects the title and episode number, then finds the **matching Reddit discussion thread** (in the anime's subreddit). Shows the thread title, subreddit, and comment stats (upvotes/comments/time) and the card that can take you to the reddit thread.

As anime fans, we love the shared experience — the memes, theories, and emotional breakdowns — that follow every episode drop.

But right now, you have to:
1. Watch an episode
2. Open Reddit
3. Manually search for the right thread

**CrunchyThread** makes this frictionless.
It's your one-click bridge from *watching* to *talking*.

## 📥 Installation

### From Chrome Web Store
1. Visit [CrunchyThread on Chrome Web Store](https://chromewebstore.google.com/detail/crunchythread/faghgokfpnffhpknonlghbogjkaafnil)
2. Click "Add to Chrome"
3. Confirm permissions

### Manual Installation (Developer Version)
1. Download the latest release from [GitHub releases](https://github.com/anistark/crunchythread/releases)
2. Extract the `.zip` file
3. Go to `chrome://extensions/`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked"
6. Select the extracted folder

## 🤝 Contributing

We welcome contributions! Here are ways you can help:

### Improve Thread Matching
Help us find better subreddits and improve search accuracy:
1. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup
2. Update the subreddit list in `data/ANIMESUBREDDITS.yaml`
3. Submit a pull request

### Report Bugs
Found an issue? [Open an issue](https://github.com/anistark/crunchythread/issues) on GitHub with:
- What you were doing
- What went wrong
- Your browser version

### Request Features
Have an idea? [Start a discussion](https://github.com/anistark/crunchythread/discussions) on GitHub.

## 📄 License

Licensed under the **MIT License** — see [LICENSE](./LICENSE) file for details.

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

## 📞 Support

- 🐛 **Report bugs**: [GitHub Issues](https://github.com/anistark/crunchythread/issues)
- 💬 **Ask questions**: [GitHub Discussions](https://github.com/anistark/crunchythread/discussions)
- 🎯 **Request features**: [Feature Requests](https://github.com/anistark/crunchythread/discussions/categories/feature-requests)

Made with 💚 for anime fans
