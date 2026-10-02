---
title: 'Two Clouds, One Site'
description: 'Deploying the same static site to Vercel and Azure Static Web Apps, and what each one teaches you.'
pubDate: 2026-10-01
tags: ['azure', 'vercel', 'devops']
---

The same `dist/` folder can be deployed to more than one host. Doing both is a cheap way to learn how modern static hosting works.

## The comparison

| | Vercel (Hobby) | Azure Static Web Apps (Free) |
|---|---|---|
| Cost | Free, non-commercial | Free SKU |
| Connects to GitLab | Natively, in a few clicks | Through a GitLab CI pipeline + deployment token |
| Preview URLs | Every branch / merge request | Pull requests (GitHub / Azure DevOps) |
| Custom domains | Yes, free SSL | 2 per app, free SSL |

## What each one teaches

**Vercel** shows how polished "git push to deploy" can be: zero config, instant previews.

**Azure SWA** shows the plumbing: a resource group, a deployment token, and a CI job that builds and uploads the site. If you already know Azure, it's familiar ground.

See `docs/DEPLOY.md` in the repo for the step-by-step guide.
