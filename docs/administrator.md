# SorryNoFocus: Administrator Guide

Everything needed to run, change, publish and deploy the site, in one place.

**Contents**

0. [Prerequisites: install Node.js, npm & Git](#0-prerequisites-install-nodejs-npm--git)
1. [Quick reference](#1-quick-reference)
2. [How the site works](#2-how-the-site-works)
3. [Project map](#3-project-map)
4. [Changing text](#4-changing-text)
5. [Writing blog posts](#5-writing-blog-posts)
6. [Resume](#6-resume)
7. [Social icons](#7-social-icons)
8. [Animations: tuning knobs](#8-animations-tuning-knobs)
9. [Look & feel: colors, fonts, spacing](#9-look--feel-colors-fonts-spacing)
10. [Git, GitLab & GitHub](#10-git-gitlab--github)
11. [Deploying: Vercel](#11-deploying-vercel)
12. [Deploying: Azure Static Web Apps](#12-deploying-azure-static-web-apps)
13. [Operations: routine tasks](#13-operations-routine-tasks)
14. [Troubleshooting](#14-troubleshooting)
15. [Costs & cleanup](#15-costs--cleanup)

---

## 0. Prerequisites: install Node.js, npm & Git

Do this once per computer. Every `npm ...` command in this guide needs **Node.js**, and **npm** (Node's package
manager) comes with it. **Git** is needed to commit and push.

| Tool    | Needed for                                        | Minimum version              |
| ------- | ------------------------------------------------- | ---------------------------- |
| Node.js | Running the dev server and building the site      | **22.12** (any current LTS)  |
| npm     | Installing dependencies, running `npm run ...`    | Comes with Node.js           |
| Git     | Commit, push, branches                            | Any recent version           |

### Check what's already installed

Open PowerShell (Start menu → type *PowerShell*) or the VS Code terminal:

```powershell
node -v      # e.g. v22.23.0  (must be 22.12 or newer)
npm -v       # e.g. 10.9.8
git --version
```

If a command says *"is not recognized as the name of a cmdlet"*, that tool isn't installed. Install it below.

### Install on Windows 11 (winget)

`winget` is built into Windows 11:

```powershell
winget install --id OpenJS.NodeJS.LTS     # Node.js LTS + npm
winget install --id Git.Git               # Git (skip if already installed)
```

Then **close and reopen PowerShell / VS Code** (so it picks up the new PATH) and run the version checks again.

*No winget?* Download the **LTS** installer from https://nodejs.org and run it with the default options (leave
"npm package manager" and "Add to PATH" checked). Git: https://git-scm.com/download/win.

### Updating later

```powershell
winget upgrade --id OpenJS.NodeJS.LTS
winget upgrade --id Git.Git
```

### Common Windows hiccup: "running scripts is disabled"

If `npm` fails in PowerShell with *"npm.ps1 cannot be loaded because running scripts is disabled on this system"*,
allow locally created scripts for your user account (one time):

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Answer `Y`. This only affects your account and still blocks unsigned scripts downloaded from the internet.

### First-time setup on a new computer

```powershell
git clone git@gitlab.com:sorrynofocus/my-web-app.git
cd my-web-app
npm install      # downloads dependencies into node_modules/ (a few minutes the first time)
npm run dev      # http://localhost:4321
```

Optional: **VS Code** (`winget install --id Microsoft.VisualStudioCode`) plus the **Astro** extension, which VS Code
suggests automatically when you open the project, for syntax highlighting in `.astro` files.

---

## 1. Quick reference

Run in PowerShell (or the VS Code terminal) inside the project folder.

| Command           | What it does                                                            |
| ----------------- | ----------------------------------------------------------------------- |
| `npm install`     | Download dependencies into `node_modules/` (once after cloning, or after `package.json` changes). |
| `npm run dev`     | Live dev server at **http://localhost:4321**. Reloads on save. Shows drafts. `Ctrl+C` stops it. |
| `npm run build`   | Build the production site into `dist/` (plain HTML/CSS/JS).             |
| `npm run preview` | Serve `dist/` locally: exactly what gets deployed.                      |
| `npm run check`   | Type-check everything (like a compiler pass). CI runs this too.         |

**Publish a change** (post, text, anything):

```powershell
npm run build                 # optional: catch errors before pushing
git add .
git commit -m "Describe the change"
git push gitlab main
git push github main          # if you mirror to GitHub
```

Vercel and the GitLab → Azure pipeline redeploy automatically within a couple of minutes.

---

## 2. How the site works

- **Static site.** `npm run build` turns every page and Markdown post into plain `.html` files in `dist/`. There is no
  server, no database and nothing to patch. Hosts just serve files.
- **Astro** is the framework that does the build. Pages are `.astro` files (HTML with a small script block at the top).
- **React** is used only for the animated parts (starfield, rocket). Astro calls these "islands": the only JavaScript
  the browser downloads.
- **Posting = git push.** Your GitLab/GitHub login is the "authentication". There is no admin login page to secure.

```
  your PC ──git push──► GitLab ──webhook──► Vercel builds & hosts
                          │
                          └── GitLab CI (.gitlab-ci.yml): build ─► deploy_azure ─► Azure SWA hosts
```

---

## 3. Project map

```
src/
  consts.ts              STRING TABLE: all visible text (home_, about_, blog_, notfound_), menus, social links
  styles/global.css      Colors, fonts, spacing (CSS variables at the top), shared styles
  content/blog/*.md      Blog posts (one file = one post)
  content/blog/media/    Images used in posts (optimized automatically)
  content.config.ts      The allowed front-matter fields for posts
  data/resume.md         Your resume (rendered on the About page)
  pages/                 One file = one URL
    index.astro            /            home page (hero + latest posts)
    about.astro            /about/      about + resume
    blog/index.astro       /blog/       all posts
    blog/[...slug].astro   /blog/<post>/  one page per post (automatic)
    tags/[tag].astro       /tags/<tag>/   one page per tag (automatic)
    404.astro              "Lost in space" page
  layouts/
    BaseLayout.astro     <head>, header, footer: wraps every page
    PostLayout.astro     Blog post layout
  components/
    Header.astro         Top menu (and mobile menu)
    Footer.astro         Bottom bar: copyright, social icons, links
    Hero.astro           Big home-page banner
    PostCard.astro       A post in a list
    SocialLinks.astro    The icon row
    icons.ts             SVG shapes for the social icons
    StarField.tsx        React: animated stars + shooting stars
    RocketFlyby.tsx      React: rocket on the About page
  lib/posts.ts           Helpers: load posts, format dates, tag URLs
public/                  Copied as-is to the site root
  favicon.svg            Browser-tab icon
  og-image.svg           Preview image when a link is shared
  images/                Blog post banner images (heroImage)
  staticwebapp.config.json   Azure settings (404 page, headers, caching)
  resume.pdf             (optional) see Resume
astro.config.mjs         Astro settings: site URL, integrations
.gitlab-ci.yml           GitLab pipeline: build + deploy to Azure
.github/workflows/       GitHub Actions alternative for Azure (manual-only)
```

---

## 4. Changing text

**All visible text lives in one file: `src/consts.ts`** (the "string table"). Pages never contain their own
wording; they read it from there. Run `npm run dev`, edit a value, save, and the browser updates instantly.

**Names are prefixed by where they appear:**

| Prefix      | Page / area                                          |
| ----------- | ---------------------------------------------------- |
| `home_`     | Home page (`/`)                                      |
| `about_`    | About page (`/about/`)                               |
| `blog_`     | Blog list, tag pages, individual posts, post cards   |
| `notfound_` | 404 page                                             |
| *(no prefix, CAPITALS)* | Site-wide: title, author, menus, footer, social links |

Rules for editing:
- Keep the quotes around each value: `'like this'`.
- An apostrophe inside single quotes needs a backslash (`'I\'m here'`), or switch that value to double quotes
  (`"I'm here"`).
- Lists in `[ ... ]` (like `about_background` or `about_currently`) take one string per item, separated by commas.
  Add or remove items freely.
- `npm run check` catches typos such as a missing quote or comma.

### Site-wide

| Name               | Where it shows up                                       |
| ------------------ | ------------------------------------------------------- |
| `SITE_TITLE`       | Top-left brand, browser tab title, footer               |
| `SITE_TAGLINE`     | Small grey line above the big home-page headline        |
| `SITE_DESCRIPTION` | Search-engine and link-preview description (default)    |
| `AUTHOR`           | Big heading on the About page, footer copyright         |
| `NAV_LINKS`        | Top menu items (`label` + `href`)                       |
| `FOOTER_LINKS`     | Text links at the bottom right (Blog, About)            |
| `SOCIAL_LINKS`     | Footer icons, see [Social icons](#7-social-icons)       |
| `A11Y`             | Screen-reader labels (not visible; read aloud by assistive technology) |

### `home_`: home page

| Name                 | What it is                                          |
| -------------------- | --------------------------------------------------- |
| `home_headline`      | The huge headline ("Build. Ship. Write it down.")   |
| `home_subtitle`      | Grey sentence under the headline                    |
| `home_buttonLabel`   | Text on the outline button                          |
| `home_buttonHref`    | Where the button goes                               |
| `home_latestHeading` | "Latest posts" label                                |
| `home_viewAllLabel`  | "View all" link                                     |
| `home_latestCount`   | How many recent posts to show (a number, no quotes) |

### `about_`: about page

| Name                        | What it is                                     |
| --------------------------- | ---------------------------------------------- |
| `about_pageTitle`           | Browser tab + small label above your name      |
| `about_intro`               | Line under your name                           |
| `about_resumeJumpLabel`     | "Resume ↓" link in the header                  |
| `about_backgroundHeading`   | "Background" label                             |
| `about_background`          | Your story, **one string per paragraph**       |
| `about_currentlyHeading`    | "Currently" label                              |
| `about_currently`           | **One string per bullet**                      |
| `about_resumeLabel`         | "Resume" label above the resume heading        |
| `about_resumeUpdatedPrefix` | "Updated" in "Resume / Updated Oct 01, 2026"   |
| `about_resumeHeading`       | "Experience & skills"                          |
| `about_resumePdfLabel`      | Text on the PDF button (only shown if `public/resume.pdf` exists) |
| `about_backToTopLabel`      | "Back to top ↑" button under the resume        |

The big heading is `AUTHOR`. The resume body itself is `src/data/resume.md`, see [Resume](#6-resume).

#### Adding paragraphs (Background) and bullets (Currently)

`about_background` is a **list**: each string becomes its own paragraph, in order. `about_currently` works the same
way, with one string per bullet.

Default:

```ts
export const about_background = [
  'Replace this with your story. Each string in this list becomes its own paragraph.',
];
```

With three paragraphs:

```ts
export const about_background = [
  'I started out in systems development, close to the hardware.',
  'These days I spend most of my time in Azure, designing how the pieces fit together.',
  "This blog is where I write down what I've learned, mostly so I don't forget it.",
];
```

Rules:
- Each item is wrapped in quotes and ends with a comma. A comma after the last item is fine.
- **Apostrophes** (I've, don't, it's): wrap that item in double quotes, like the third line above, or keep single
  quotes and escape it: `'I\'ve learned'`.
- Long paragraphs can stay on one line.
- To remove a paragraph or bullet, delete its line.
- **Plain text only.** Markdown (`**bold**`, `[links](...)`) is not rendered here and would appear literally. For
  formatted text, use the resume (`src/data/resume.md`), which is full Markdown.
- A typo (missing quote or comma) shows an error with the line number in `npm run dev`, or run `npm run check`.

### `blog_`: blog list, tag pages, posts

| Name                      | What it is                                       |
| ------------------------- | ------------------------------------------------ |
| `blog_pageTitle`          | "Blog" heading + browser tab                     |
| `blog_pageDescription`    | Search/link-preview description of `/blog/`      |
| `blog_postCountSingular`  | "post" in "1 post"                               |
| `blog_postCountPlural`    | "posts" in "5 posts"                             |
| `blog_backToAll`          | "← All posts" link on posts and tag pages        |
| `blog_tagPageLabel`       | Small "Tagged" label on `/tags/<tag>/`           |
| `blog_tagPageTitlePrefix` | Browser-tab prefix on tag pages ("Tagged: azure") |
| `blog_readMore`           | "Read →" on each post card                       |
| `blog_updatedPrefix`      | "Updated" before a post's `updatedDate`          |
| `blog_draftLabel`         | "Draft" marker (dev mode only)                   |

### `notfound_`: 404 page

`notfound_pageTitle`, `notfound_label` ("Error 404"), `notfound_heading`, `notfound_message`, `notfound_buttonLabel`.

### Text that is *not* in the string table

| What                    | File                                                                     |
| ----------------------- | ------------------------------------------------------------------------ |
| Blog posts              | `src/content/blog/*.md`, see [Writing blog posts](#5-writing-blog-posts) |
| Resume body             | `src/data/resume.md`                                                     |
| Link-preview image text | `public/og-image.svg` (open in VS Code; text is in `<text>` tags)        |

---

## 5. Writing blog posts

### Create the file

Add a Markdown file to `src/content/blog/`. **The file name becomes the URL**, so use lowercase words with dashes:

```
src/content/blog/my-first-azure-vm.md   ->   /blog/my-first-azure-vm/
```

Sub-folders work too: `src/content/blog/2026/recap.md` becomes `/blog/2026/recap/`.

### Front-matter (the header block)

```markdown
---
title: 'My First Azure VM'
description: 'One or two sentences. Shown in lists, search results and link previews.'
pubDate: 2026-10-05
tags: ['azure', 'infrastructure']
# Optional:
# updatedDate: 2026-10-10
# heroImage: '/images/my-first-azure-vm.jpg'
# draft: true
---

Your post starts here...
```

| Field         | Required | Notes                                                     |
| ------------- | -------- | --------------------------------------------------------- |
| `title`       | yes      |                                                           |
| `description` | yes      |                                                           |
| `pubDate`     | yes      | `YYYY-MM-DD`. Posts are sorted newest first.              |
| `tags`        | no       | Each tag gets its own page at `/tags/<tag>/`.             |
| `updatedDate` | no       | Shows "Updated ..." under the date.                       |
| `heroImage`   | no       | Wide banner image + link-preview picture. File in `public/images/`, written `/images/name.jpg`. |
| `draft`       | no       | `true` = visible in `npm run dev` only, never published.  |

The rules live in `src/content.config.ts`. A misspelled field or bad date fails the build with a clear message.

### Markdown cheat-sheet

````markdown
## Section heading
### Sub-heading

Paragraph with **bold**, *italic*, `inline code` and a [link](https://example.com).

- bullet
- list

1. numbered
2. list

> A quote

![Describe the image](./media/diagram.png)

```bash
az group create -n rg-demo -l eastus
```

| Column | Column |
| ------ | ------ |
| cell   | cell   |
````

### Images

There are **two image folders**, depending on where the image appears:

| Image                    | Put the file in             | Write the path as            |
| ------------------------ | --------------------------- | ---------------------------- |
| **Banner** (top of post) | `public/images/`            | `/images/my-banner.jpg`      |
| **Inside the post**      | `src/content/blog/media/`   | `./media/my-screenshot.png`  |

#### Banner

Set `heroImage` in the front-matter at the top of the post. Put the file in `public/images/` and write the path
starting with `/images/`. The banner shows across the top of the post. It is also the picture used in link previews.

```markdown
---
title: 'My first Azure VM'
description: 'Creating a VM with the Azure CLI.'
pubDate: 2026-10-01
tags: ['azure']
heroImage: '/images/my-banner.jpg'
---
```

#### Inline image

Put the file in `src/content/blog/media/` and write the path starting with `./media/`:

```markdown
![Diagram of the commit, build and deploy pipeline](./media/example-diagram.png)
```

The text in `[square brackets]` is the **alt text**. It is a short description, read aloud by screen readers and
shown if the image fails to load. Describe what's in the image.

#### Image with a caption

Markdown has no caption syntax, so put an italic line right under the image:

```markdown
![Pipeline diagram](./media/example-diagram.png)
*Every push runs through the same three stages.*
```

The site styles that line small and grey, directly under the image.

#### Tips

- **Formats:** `.jpg` for photos, `.png` for screenshots and diagrams. `.webp`, `.gif` and `.svg` also work.
- **Inline images (`./media/`) are optimized automatically:** at build time Astro converts them to WebP and adds
  width/height so pages don't jump while loading. You don't need to resize them; originals up to ~3000px wide are
  fine. A wrong path fails the build with a clear error, so a broken image never reaches the live site.
- **Banners (`public/images/`) are served as-is,** unoptimized. Keep them about 1600–2000px wide and under ~500 KB.
  A wrong banner path does *not* fail the build; check the post in `npm run dev`.
- **Names:** lowercase with dashes, no spaces: `azure-vm-portal.png`, not `Azure VM Portal.png`.
- **Organizing:** for lots of images, use a sub-folder per post: `./media/azure-vm/step-1.png`.

An example post (`src/content/blog/image-example.md`) may still exist in the repo; it's safe to delete it along with
`public/images/example-banner.jpg` and `src/content/blog/media/example-diagram.png`. These instructions don't depend
on it.

### Preview, then publish

```powershell
npm run dev            # check it at http://localhost:4321/blog/
git add .
git commit -m "Post: My first Azure VM"
git push gitlab main
git push github main
```

**Tip:** write longer posts on a branch (`git switch -c post/azure-vm`, then `git push -u gitlab post/azure-vm`).
Vercel gives the branch its own **preview URL** so you can check it on your phone before merging.

Delete `src/content/blog/draft-example.md` once you've seen how drafts work.

---

## 6. Resume

**File:** `src/data/resume.md`. Plain Markdown, rendered at the bottom of the About page (`/about/#resume`).

- `## Heading` = section (Summary, Experience, Skills...)
- `### Heading` = job title / degree
- The line right under a `###` (e.g. `**2022 to Present** · Remote`) is shown smaller and grey, for dates and location
- `- item` = bullets; tables work too (see the Skills section)
- `<!-- comments -->` never appear on the page
- Update `updated:` at the top when you change it. It shows as "Resume / Updated Oct 01, 2026".

**PDF download (optional):** copy your PDF to `public/resume.pdf`. A "Download PDF" button appears automatically.
Remove the file and the button goes away. Replace the PDF whenever you update the Markdown.

> The site is public. Leave phone number and home address out. An email or LinkedIn link is enough.

---

## 7. Social icons

**File:** `SOCIAL_LINKS` in `src/consts.ts`. Each line is `{ label, icon, href }`.

- **Change a URL:** edit `href`.
- **Remove one:** delete its line.
- **Reorder:** move lines (file order = page order).
- **Add a new site:** the `icon` must exist in `src/components/icons.ts`. Find the logo on
  https://simpleicons.org, copy its 24×24 SVG path (the long `d="..."` string) into `icons.ts` under a new name, then
  use that name as `icon`. `npm run check` flags a misspelled icon name.

Notes:
- GitHub, GitLab, X and Instagram icons come from Simple Icons (CC0). LinkedIn and Microsoft are simple hand-drawn
  versions, because those brands aren't in Simple Icons.
- Links open in a new tab with `rel="noopener me"`. Destination sites see your domain as the referrer (not the page
  path). `me` tells sites like GitHub/Mastodon these profiles belong to you.

---

## 8. Animations: tuning knobs

All are plain numbers near the top of each file. Save while `npm run dev` is running to see the change immediately.

### Starfield + shooting stars: `src/components/StarField.tsx`

Used on the home page hero and the About page header.

| Setting                            | Default       | Effect                                                    |
| ---------------------------------- | ------------- | --------------------------------------------------------- |
| `METEOR_MIN_GAP` / `METEOR_MAX_GAP`| 2500 / 9000   | Random wait between shooting stars, in ms. Lower = more often. |
| `const velocity = rand(4.5, 7.5)`  | 4.5–7.5       | Shooting-star speed (px per frame). Lower = slower.       |
| `const maxLife = ... rand(70, 115)`| 70–115        | How long each one is visible (frames; 60 ≈ 1 second).     |
| `length: rand(90, 180)`            | 90–180        | Tail length in px.                                        |
| `Math.random() < 0.15`             | 0.15          | Chance (15%) of a second shooting star at the same time.  |
| `density` (prop)                   | 1.2           | Number of background stars. Set per page: `<StarField client:load density={2} />` |
| `speed` (prop)                     | 0.08          | Background star drift speed: `<StarField client:load speed={0.15} />` |

### Rocket fly-by: `src/components/RocketFlyby.tsx`

Used on the About page header.

| Setting        | Default          | Effect                                                 |
| -------------- | ---------------- | ------------------------------------------------------ |
| `FIRST_DELAY`  | [2000, 5000]     | Wait before the first pass after page load (ms).       |
| `GAP`          | [12000, 30000]   | Random wait between passes (ms).                       |
| `DURATION`     | [11, 16]         | Seconds to cross the screen. Higher = slower.          |
| `top: rand([25, 75])` | 25–75%    | Vertical range it flies through.                       |
| `climb: rand([40, 140])` | 40–140 px | How much it rises while crossing.                  |
| `reverse: Math.random() < 0.3` | 30% | Chance of flying right-to-left.                    |
| `opacity` (prop) | 0.45           | Body/trail faintness. The flame is drawn at twice this (max 1). Set in `about.astro`: `<RocketFlyby client:idle opacity={0.3} />` |

Flame colors are the `<linearGradient>` stops inside the component (`#ffb347`, `#ff6a1a`...).

### Other motion

| Effect                                | Where                                                       |
| ------------------------------------- | ----------------------------------------------------------- |
| Hero text rise-in                     | `src/components/Hero.astro`, `animation: rise 1.4s`         |
| Fade-in on scroll (`class="reveal"`)  | `src/styles/global.css`, "Scroll reveal" section            |
| Button fill on hover                  | `src/styles/global.css`, `.btn` rules                        |

**Accessibility:** visitors with "reduce motion" turned on in their OS get a still starfield, no shooting stars and no
rocket. All animations pause when the tab is hidden.

### Add the starfield or rocket to another page

```astro
---
import StarField from '../components/StarField';
import RocketFlyby from '../components/RocketFlyby';
---
<section style="position: relative; overflow: hidden;">
  <StarField client:load />
  <RocketFlyby client:idle />
  <div style="position: relative; z-index: 1;">...content...</div>
</section>
```

`client:load` / `client:idle` tell Astro to run the React component in the browser (now, or once the page is idle).

---

## 9. Look & feel: colors, fonts, spacing

**File:** `src/styles/global.css`, the `:root { ... }` block at the top.

| Variable          | What it controls                       |
| ----------------- | -------------------------------------- |
| `--bg`            | Page background (black)                |
| `--fg`            | Main text color                        |
| `--fg-muted`      | Grey secondary text                    |
| `--line`          | Thin divider lines                     |
| `--font-display`  | Headings (Barlow Condensed)            |
| `--font-label`    | Small uppercase labels, menu (Barlow)  |
| `--font-body`     | Body text (Inter)                      |
| `--max-w`         | Max content width                      |
| `--prose-w`       | Max width of post/resume text          |

The space gradient behind the hero is in `src/components/Hero.astro` (`.hero { background: ... }`) and behind the
About header in `src/pages/about.astro` (`.page-head { background: ... }`).

Fonts are self-hosted via `@fontsource` packages (imported at the top of `global.css`), so there are no calls to Google.

---

## 10. Git, GitLab & GitHub

> Mental model: git is a local database of snapshots. GitLab and GitHub are *remote copies* of it.
> `git push <remote> <branch>` sends your snapshots there. The folder's location on disk doesn't matter.

### One-time setup

Upgrade git (2.30 is from 2021):

```powershell
winget upgrade --id Git.Git
```

Identity (already set on this PC; shown for reference):

```powershell
git config --global user.name  "SorryNoFocus"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

> Privacy: GitLab (*Preferences > Profile > Commit email*) and GitHub (*Settings > Emails*) offer a no-reply commit
> address if you don't want your real email in public history.

### Authentication: SSH key (recommended; one key works for both)

```powershell
ssh-keygen -t ed25519 -C "my-laptop"        # Enter for default path; passphrase recommended
Get-Content $HOME\.ssh\id_ed25519.pub | Set-Clipboard
```

- **GitLab:** avatar > **Edit profile** > **SSH Keys** > **Add new key** > paste
- **GitHub:** avatar > **Settings** > **SSH and GPG keys** > **New SSH key** > paste

```powershell
ssh -T git@gitlab.com     # "Welcome to GitLab, @sorrynofocus!"
ssh -T git@github.com     # "Hi sorrynofocus! ..."
```

Never share `id_ed25519` (no `.pub`), the private key.

*Alternative:* use `https://` URLs. Git Credential Manager pops up a browser login on first push.

### Create the empty projects (web UI)

- **GitLab:** **New project** > **Create blank project** > name `my-web-app` > **uncheck "Initialize repository with a README"** > Create.
- **GitHub:** https://github.com/new > name `my-web-app` > **no** README/.gitignore/license > Create.

The repo must be empty or the first push is rejected.

### Connect and push

```powershell
git remote add gitlab git@gitlab.com:sorrynofocus/my-web-app.git
git remote add github git@github.com:sorrynofocus/my-web-app.git
git remote -v

git push -u gitlab main      # -u: plain `git push` / `git pull` now default to GitLab
git push github main
```

**Optional, one command pushes to both:**

```powershell
git remote add origin git@gitlab.com:sorrynofocus/my-web-app.git
git remote set-url --add --push origin git@gitlab.com:sorrynofocus/my-web-app.git
git remote set-url --add --push origin git@github.com:sorrynofocus/my-web-app.git
git push -u origin main
```

Or let GitLab mirror for you: *Settings > Repository > Mirroring repositories* (push mirror with a GitHub token).

### Daily loop

```powershell
git status                 # what changed?
git diff                   # exact line changes
git add .                  # stage everything
git commit -m "Message"
git push
git log --oneline -10      # recent history
git pull                   # get changes made elsewhere (e.g. edits in the GitLab web UI)
```

### Branches & Merge Requests

```powershell
git switch -c feature/new-theme
# ...edit, commit...
git push -u gitlab feature/new-theme
```

GitLab prints a link to **create a merge request**. Open it, review, then **Merge**. Afterwards:

```powershell
git switch main
git pull
git branch -d feature/new-theme
```

### Undo cheatsheet

| Situation                                        | Command                               |
| ------------------------------------------------ | ------------------------------------- |
| Discard unsaved edits to a file                  | `git restore path\to\file`            |
| Unstage a file (keep edits)                      | `git restore --staged path\to\file`   |
| Fix last commit message (not pushed yet)         | `git commit --amend -m "new message"` |
| Undo a pushed commit safely (adds a reverse commit) | `git revert <commit-sha>`          |

Avoid `git push --force` on `main`.

---

## 11. Deploying: Vercel

**Plan:** Hobby (free, personal/non-commercial). Vercel builds on its own servers; no config file needed.

1. Push the repo to GitLab.
2. https://vercel.com/new > **Import Git Repository** > **GitLab** > authorize.
3. Pick `my-web-app` > **Import**. Framework preset **Astro** is auto-detected (build `npm run build`, output `dist`).
4. **Deploy**. You'll get `https://my-web-app-xxxx.vercel.app`.

After that:
- Push to `main` → **production** deploy.
- Push any other branch / open an MR → **preview URL** (Vercel comments it on the MR).
- **Deployments** tab → build logs; **Promote to Production** on an older deploy = instant rollback.

Optional CLI:

```powershell
npm i -g vercel
vercel login
vercel           # preview deploy of the current folder
vercel --prod    # production deploy
```

---

## 12. Deploying: Azure Static Web Apps

**Plan:** Free. Azure's wizard only connects to GitHub/Azure DevOps, so GitLab uses **Source = Other** plus a
**deployment token** that the GitLab pipeline (`.gitlab-ci.yml`) uses to upload `dist/`.

### Create the resource

1. Portal > **Resource groups** > **Create** > `rg-myblog`.
2. **Create a resource** > **Static Web App** > **Create**:

   | Setting        | Value                                      |
   | -------------- | ------------------------------------------ |
   | Resource group | `rg-myblog`                                |
   | Name           | `my-web-app`                               |
   | **Plan type**  | **Free**                                   |
   | Region         | nearest (API region only; site is global)  |
   | **Source**     | **Other**                                  |

3. **Review + create** > **Create** > **Go to resource** > **Manage deployment token** > copy it.

### Give the token to GitLab

GitLab project > **Settings > CI/CD** > **Variables** > **Add variable**:

- **Key:** `DEPLOYMENT_TOKEN`
- **Value:** the token
- **Visibility:** Masked
- **Protect variable:** checked (`main` is protected, so deploys work; feature branches can't read it)
- **Environments:** `*`

### Deploy

Push to `main` (or **Build > Pipelines > Run pipeline**). Jobs: `build` → `deploy_azure`. When green, open the URL on
the Static Web App **Overview** page (`https://<name>.azurestaticapps.net`).

How the pipeline works:
- `build` runs on **every** branch: `npm ci`, `npm run check`, `npm run build`. Broken posts fail here, not on the live site.
- `deploy_azure` runs only on `main` **and** only if `DEPLOYMENT_TOKEN` exists. It uploads `dist/` with the official
  Azure SWA CLI.

### Using GitHub for Azure instead

`.github/workflows/azure-swa.yml` does the same from GitHub Actions. It's **manual-only** to avoid double deploys. To
switch: add GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN`, uncomment the `push:` trigger in that file, and delete the
GitLab `DEPLOYMENT_TOKEN` variable.

### `public/staticwebapp.config.json`

Read by Azure only: serves the custom 404 page, adds security headers and long-term caching for `/_astro/*` files.
Vercel ignores it (it serves `404.html` automatically).

### Vercel vs Azure

|                     | Vercel (Hobby)                       | Azure SWA (Free)                               |
| ------------------- | ------------------------------------ | ---------------------------------------------- |
| Cost                | $0, non-commercial                   | $0                                             |
| GitLab connection   | Native (click, authorize)            | Deployment token + your CI pipeline            |
| Who builds          | Vercel's servers                     | Your GitLab CI runner (`node:22`)              |
| Preview deploys     | Every branch/MR, automatic           | GitHub/Azure DevOps PRs; DIY with GitLab        |
| Rollback            | One click                            | Re-run an older pipeline                       |
| Custom domain + SSL | Free                                 | Free (2 per app)                               |

### Custom domain (optional)

- **Vercel:** Project > **Settings > Domains** > add `blog.example.com` > create the CNAME shown (`cname.vercel-dns.com`).
- **Azure:** Static Web App > **Custom domains** > **Add** > *Custom domain on other DNS* > create the CNAME shown.

A hostname points at one host at a time (e.g. `www.` → Vercel, `azure.` → Azure). Afterwards set `site:` in
`astro.config.mjs` to the final URL and push.

---

## 13. Operations: routine tasks

| Task                         | How                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| Publish a post               | Add `.md` in `src/content/blog/` → commit → push. See [section 5](#5-writing-blog-posts). |
| Unpublish a post             | Set `draft: true` (keeps the file) or delete the file → commit → push.                  |
| Update resume                | Edit `src/data/resume.md` (+ replace `public/resume.pdf` if used) → commit → push.      |
| Check a deploy               | Vercel: **Deployments** tab. Azure: GitLab **Build > Pipelines** → `deploy_azure` log.  |
| Roll back (Vercel)           | **Deployments** → older deploy → **Promote to Production**.                             |
| Roll back (Azure)            | `git revert <sha>` → push (or **Run pipeline** on an older commit).                     |
| Rotate the Azure token       | Portal → Static Web App → **Manage deployment token** → **Reset** → update GitLab `DEPLOYMENT_TOKEN`. Do this if the token ever leaks. |
| Pause Azure deploys          | Delete (or rename) the GitLab `DEPLOYMENT_TOKEN` variable. `build` keeps running.       |
| See what's outdated          | `npm outdated`                                                                          |
| Update dependencies (safe)   | `npm update` → `npm run build` → test → commit `package.json` + `package-lock.json`.   |
| Upgrade Astro (major)        | `npx @astrojs/upgrade` → read its notes → build → test → commit.                        |
| Security check               | `npm audit` (only matters for build tools here; the live site is static files).         |
| Change the site URL          | `site:` in `astro.config.mjs` (sitemap + share previews use it).                        |

**Before going live (one-time):** set `site:` in `astro.config.mjs`, fill in About text and resume, delete
`src/content/blog/draft-example.md`.

---

## 14. Troubleshooting

| Symptom                                         | Likely cause / fix                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| Build error mentioning a post's front-matter    | Missing `title`/`description`/`pubDate`, or bad date. The message names the file and field. |
| `npm run check` error about `icon`              | `SOCIAL_LINKS` uses an icon name that isn't in `src/components/icons.ts`.            |
| Post not showing on the live site               | `draft: true` is set, or the push didn't reach `main`.                              |
| GitLab pipeline has no `deploy_azure` job       | Not on `main`, or `DEPLOYMENT_TOKEN` is missing / protected-but-branch-unprotected.  |
| `deploy_azure` fails with an auth error         | Token was reset or pasted wrong: copy it again from the portal into the GitLab variable. |
| First `git push` rejected ("fetch first")       | The remote repo isn't empty (README was created). `git pull gitlab main --allow-unrelated-histories`, then push. |
| `Permission denied (publickey)`                 | SSH key not added to that site, or wrong account. Re-run `ssh -T git@gitlab.com`.    |
| Dev server port busy                            | Another `npm run dev` is running. Close that terminal or use `npm run dev -- --port 4322`. |
| Animations don't play                           | OS "reduce motion" is on (intended), or the tab was in the background.              |
| Change not visible in browser                   | Hard refresh: `Ctrl+F5`.                                                            |
| Deleted post still shows in `npm run dev`       | The dev server cached it. `Ctrl+C`, then `npm run dev` again. Still there? Stop it, run `Remove-Item -Recurse -Force .astro, node_modules\.astro`, restart. (The live site always builds fresh, so it's unaffected.) |

---

## 15. Costs & cleanup

- **Vercel Hobby:** free for personal, non-commercial use.
- **Azure SWA Free:** $0. Stay at $0 by: keeping the plan on **Free** (Standard ≈ $9/month), not linking a Functions
  app or backend, and adding a safety budget: **Cost Management > Budgets** on `rg-myblog`, e.g. $1 with email alert.
  Limits: 100 GB bandwidth/month, 250 MB app size, 2 custom domains.
- **GitLab CI:** free tier includes monthly compute minutes; this pipeline uses about 1–2 minutes per push.
- **Tear down Azure:** delete resource group `rg-myblog`.
- **Tear down Vercel:** Project > **Settings** > **Delete Project**.
