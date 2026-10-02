# Sorry No Focus: personal site & blog

A minimal, dark, SpaceX-inspired static site and blog built with [Astro](https://astro.build) and React.
Posts are Markdown files. Publishing a post is `git push`.

## Quick start

```powershell
npm install        # once, after cloning (downloads dependencies into node_modules/)
npm run dev        # live dev server at http://localhost:4321 (auto-reloads on save)
```

Press `Ctrl+C` in the terminal to stop the dev server.

## Commands

| Command           | What it does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload. Shows drafts.                                 |
| `npm run build`   | Builds the production site into `dist/` (plain HTML/CSS/JS).              |
| `npm run preview` | Serves `dist/` locally, so you see exactly what will be deployed.         |
| `npm run check`   | Type-checks the project (like a compiler pass). CI runs this too.         |

## Project layout

```
src/
  consts.ts            <- site title, tagline, author, nav links: start here
  styles/global.css    <- colors, fonts, spacing (CSS variables at the top)
  content/blog/*.md    <- blog posts
  pages/               <- one file = one URL (about.astro -> /about/)
  layouts/             <- page shells (BaseLayout = head/nav/footer, PostLayout = article)
  components/          <- reusable pieces (Header, Hero, PostCard, StarField.tsx = React)
public/                <- copied as-is to the site root (favicon, images, Azure config)
docs/                  <- how-to guides
```

## Guides

1. [Writing posts](docs/WRITING-POSTS.md)
2. [Git, GitLab & GitHub from the command line](docs/GIT-GITLAB-GITHUB.md)
3. [Deploying to Vercel and Azure Static Web Apps](docs/DEPLOY.md)

## Before going live

- Edit `src/consts.ts` (title, author, tagline) and `src/pages/about.astro`.
- Set `site:` in `astro.config.mjs` to your real URL (used by the sitemap, RSS and share previews).
- Delete `src/content/blog/draft-example.md`.
