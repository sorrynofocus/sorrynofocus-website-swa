---
title: 'Hello, World'
description: 'First transmission. Why this site exists and how it is built.'
pubDate: 2026-09-30
tags: ['meta', 'astro']
---

Every systems developer has written a `main()` that prints this line. This is the web version.

## How this site works

This site is **static**: when I run `npm run build`, Astro turns every page and every Markdown post into a plain `.html` file in `dist/`. There is no server, no database and nothing to patch. Any static host (Vercel, Azure Static Web Apps, GitLab Pages) just serves those files.

- **Posts** are Markdown files in `src/content/blog/`
- **Pages** are `.astro` files in `src/pages/` (the file path *is* the URL)
- **Interactive bits** are React components, like the starfield on the home page

## Publishing a post

```bash
git add src/content/blog/my-new-post.md
git commit -m "New post: my new post"
git push
```

The host sees the push, rebuilds the site and deploys it in about a minute.

> Think of it like a CI pipeline where the build artifact is a website.
