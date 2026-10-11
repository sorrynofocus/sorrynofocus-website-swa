# Site source: SorryNoFocus - personal site & blog

Host: [Vercel - SorryNoFocus](https://my-web-app-wine-alpha.vercel.app/)
Source: [Gitlab -my-web-app](https://gitlab.com/sorrynofocus/my-web-app) 

Host: [Azure web apps site - SorryNoFocus](https://icy-field-00abe291e.2.azurestaticapps.net)
Source: [GitHub -sorrynofocus-website-swa](https://github.com/sorrynofocus/sorrynofocus-website-swa) 

Instructions to me: Modify one source repo, sync code and push to both. I could add two origins, but keeping github/gitlab source separate is ideal. 

The website is described as a minimal, dark, SpaceX-inspired static site and blog built with [Astro](https://astro.build) and React.
Posts are Markdown files. 

Requires **Node.js 22.12+** (includes npm). Not installed? See [Prerequisites](docs/administrator.md#0-prerequisites-install-nodejs-npm--git).

```powershell
npm install        # once, after cloning
npm run dev        # http://localhost:4321
```

**Everything else** (changing text, writing posts, resume, social icons, animation tuning, git, deploying to
Vercel and Azure, routine operations, troubleshooting) is in **[docs/administrator.md](docs/administrator.md)**.
