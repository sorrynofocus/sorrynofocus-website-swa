# Deploying: Vercel and Azure Static Web Apps

Both hosts serve the same thing: the static files Astro builds into `dist/`. The difference is **who runs the build**
and **how they hear about your push**:

```
                     git push
   your PC  ───────────────────────►  GitLab  ──(webhook)──►  Vercel builds & hosts      (Part 1)
                                        │
                                        └── GitLab CI (.gitlab-ci.yml)
                                              build ─► deploy_azure ─► Azure SWA hosts   (Part 2)
```

Do Part 1 first. It takes about 5 minutes and gives you a live URL right away.

---

## Part 1: Vercel (Hobby plan, free)

1. Push the repo to GitLab first (see `GIT-GITLAB-GITHUB.md`).
2. Go to https://vercel.com/new and sign in.
3. Under **Import Git Repository**, choose **GitLab** and authorize Vercel when prompted.
   (Signed up with GitHub? You can still add GitLab as a provider here, or under Account Settings > Authentication.)
4. Select `my-web-app` and click **Import**.
5. Vercel auto-detects **Framework Preset: Astro**. Leave everything as is:
   - Build command `npm run build`, output directory `dist`, Node.js 22.x
6. Click **Deploy**. About a minute later you get a URL like `https://my-web-app-xxxx.vercel.app`.

### What you get from here on
- Every push to `main` deploys to **production**.
- Every other branch or merge request gets its own **preview URL**, and Vercel comments the link on the GitLab MR.
- **Deployments** tab: the build log for each deploy, plus one-click **rollback** ("Promote to Production" on an older deploy).

### Optional: Vercel CLI (to learn what happens under the hood)
```powershell
npm i -g vercel
vercel login
vercel          # deploys the current folder as a preview
vercel --prod   # deploys to production
```

### Limits (Hobby)
Free for **personal, non-commercial** use. 100 GB bandwidth/month, which is plenty for a blog. Custom domains and SSL are free.

---

## Part 2: Azure Static Web Apps (Free plan)

Azure's portal wizard only connects to GitHub and Azure DevOps directly. For GitLab you use **deployment source "Other"**
plus a **deployment token** that your GitLab pipeline uses to upload the site. The pipeline is already written:
`.gitlab-ci.yml`.

### 2a. Create the resource
1. https://portal.azure.com > **Resource groups** > **Create**: name `rg-myblog`, any region > **Review + create**.
2. **Create a resource** > search **Static Web App** > **Create**.

   | Setting         | Value                                                         |
   | --------------- | ------------------------------------------------------------- |
   | Subscription    | your pay-as-you-go subscription                               |
   | Resource group  | `rg-myblog`                                                   |
   | Name            | `my-web-app`                                                  |
   | **Plan type**   | **Free** ← important                                          |
   | Region          | closest to you (this region is for the API backend only; the site is served globally) |
   | **Source**      | **Other**                                                     |

3. **Review + create** > **Create** > **Go to resource**.
4. On the **Overview** page, click **Manage deployment token** and copy the token.

### 2b. Give the token to GitLab
1. GitLab project > **Settings > CI/CD** > expand **Variables** > **Add variable**.
2. Fill in:
   - **Key:** `DEPLOYMENT_TOKEN`
   - **Value:** paste the token
   - **Visibility:** *Masked* (hides it in job logs)
   - **Flags:** leave *Protect variable* **checked**. `main` is a protected branch by default, so the deploy can still read it, but feature branches can't.
   - **Environments:** `*` (All)
3. **Add variable.**

### 2c. Deploy
Push any commit to `main`, or re-run the latest pipeline (**Build > Pipelines** > **Run pipeline**). You'll now see two
jobs: `build` → `deploy_azure`. When it's green, open the URL shown on the Azure SWA **Overview** page
(`https://<random-name>.azurestaticapps.net`).

### Keeping Azure at $0
- The **Free** plan has no charge. Don't switch the plan to *Standard* (about $9/month).
- Don't link an Azure Functions app or "bring your own" backend. This site doesn't need one.
- Free plan limits: 100 GB bandwidth/month, 250 MB app size, 2 custom domains, free SSL.
- Safety net: **Cost Management > Budgets** > create a budget on `rg-myblog` (e.g. $1) with an email alert.
- To tear it all down: delete the resource group `rg-myblog`.

### Using GitHub for Azure instead
`.github/workflows/azure-swa.yml` does the same job from GitHub Actions. It's manual-only by default so you don't
deploy twice; the comments at the top of that file explain how to switch it on.

### `staticwebapp.config.json`
`public/staticwebapp.config.json` is copied into `dist/` and read by Azure. It serves the custom 404 page, adds
security headers and long-term caching for hashed assets. Vercel ignores it, since Vercel serves `404.html` automatically.

---

## Side-by-side

|                          | Vercel (Hobby)                             | Azure SWA (Free)                                    |
| ------------------------ | ------------------------------------------ | --------------------------------------------------- |
| Cost                     | $0, non-commercial use                     | $0                                                  |
| GitLab connection        | Native: click, authorize, done             | Deployment token + your own CI pipeline             |
| Who builds the site      | Vercel's build servers                     | Your GitLab CI runner (`node:22` container)         |
| Preview deployments      | Every branch / MR, automatic               | Built in for GitHub/Azure DevOps PRs; DIY with GitLab |
| Rollback                 | One click in dashboard                     | Re-run an older pipeline                            |
| Custom domain + SSL      | Yes, free                                  | Yes, free (2 per app)                               |
| Fits with                | Next.js/frontend ecosystem                 | Your existing Azure world: RGs, RBAC, Entra ID, Functions |
| What you learn           | Modern "git push to deploy" DX             | CI/CD plumbing, tokens, Azure resource model        |

---

## Custom domain (optional, either host)

**Vercel:** Project > **Settings > Domains** > add `blog.example.com` and create the DNS record it shows (CNAME to
`cname.vercel-dns.com`).

**Azure:** Static Web App > **Custom domains** > **Add** > *Custom domain on other DNS* > create the CNAME it shows
(pointing at your `*.azurestaticapps.net` host) and wait for validation.

A domain can point at only one host at a time. A common setup is `www.` on one and `azure.` on the other while you compare.

Afterwards, set `site:` in `astro.config.mjs` to the final URL and push.
