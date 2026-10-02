# Writing posts

## 1. Create the file

Add a Markdown file to `src/content/blog/`. **The file name becomes the URL**, so use lowercase words with dashes:

```
src/content/blog/my-first-azure-vm.md   ->   https://your-site/blog/my-first-azure-vm/
```

Sub-folders work too: `src/content/blog/2026/recap.md` becomes `/blog/2026/recap/`.

## 2. Front-matter (the header block)

Every post starts with a YAML block between `---` lines:

```markdown
---
title: 'My First Azure VM'
description: 'One or two sentences. Shown on the blog list, in search results and link previews.'
pubDate: 2026-10-05
tags: ['azure', 'infrastructure']
# Optional:
# updatedDate: 2026-10-10
# heroImage: '/images/my-first-azure-vm.jpg'
# draft: true
---

Your post starts here...
```

| Field         | Required | Notes                                                                |
| ------------- | -------- | -------------------------------------------------------------------- |
| `title`       | yes      |                                                                      |
| `description` | yes      |                                                                      |
| `pubDate`     | yes      | `YYYY-MM-DD`. Posts are sorted newest first.                         |
| `tags`        | no       | Each tag gets its own page at `/tags/<tag>/`.                        |
| `updatedDate` | no       | Shows "Updated ..." under the date.                                  |
| `heroImage`   | no       | Wide banner image. Put the file in `public/images/`.                 |
| `draft`       | no       | `true` = visible in `npm run dev` only, never published.             |

The schema lives in `src/content.config.ts`. If you misspell a field or use a bad date, the build fails with a clear message, much like a compiler error.

## 3. Markdown cheat-sheet

````markdown
## Section heading
### Sub-heading

Plain paragraph with **bold**, *italic*, `inline code` and a [link](https://example.com).

- bullet
- list

1. numbered
2. list

> A quote

![Alt text describing the image](/images/diagram.png)

```bash
az group create -n rg-demo -l eastus
```

| Column | Column |
| ------ | ------ |
| cell   | cell   |
````

Images go in `public/images/` and are referenced as `/images/name.png`.

## 4. Preview locally

```powershell
npm run dev
```

Open http://localhost:4321/blog/. The page reloads every time you save.

## 5. Publish

```powershell
git add .
git commit -m "Post: My first Azure VM"
git push gitlab main
git push github main     # if you push to both, see GIT-GITLAB-GITHUB.md
```

Vercel and the GitLab pipeline (Azure) both notice the push and redeploy within a minute or two.

## Tip: work on a post on a branch

```powershell
git switch -c post/azure-vm      # new branch
# ...write, commit...
git push -u gitlab post/azure-vm
```

Vercel gives that branch its own **preview URL**, so you can check it on your phone before merging into `main`.
