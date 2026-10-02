---
title: 'Hello, World'
description: 'First transmission. Why this site exists and how it is built.'
pubDate: 2026-09-30
tags: ['meta', 'astro', 'intro']
---

Every systems developer has written a `main()` that prints this line. This is the web version.

## How this site works

This site is **static**: when I run `npm run build`, Astro turns every page and every Markdown post into a plain `.html` file in `dist/`. There is no server, no database and nothing to patch. Any static host (Vercel, Azure Static Web Apps, GitLab Pages) just serves those files.

- **Posts** are Markdown files in `src/content/blog/`
- **Pages** are `.astro` files in `src/pages/` 
- **Interactive bits** are React components, like the starfield on the home page

## Exists

The site exists because I wanted to push a portfolio to an Azure SWA and Vercel. Many places ask for a _portfolio_. 

I am  _not_ a web developer. I'm more of a platform, system developer, so it's more of writing tools or a quick WinForms/WPF application. I am learning STM32 embedding development. I plan to write and build soemthing that interacts with Bluetooth and Wifi comms. At the moment, I am looking for work and hopefully that opportunity comes quick. 

Anyway, I hope you like the site.


