# Git, GitLab & GitHub from the command line

The local repo is already initialized (`git init`) with one commit on `main`.
**Nothing has been pushed anywhere yet.** This guide takes you from here to the code living on both GitLab and GitHub.

> Mental model: git is a local database of snapshots. GitLab and GitHub are just *remote copies* of that database.
> `git push <remote> <branch>` sends your snapshots to a remote. The folder's location on disk doesn't matter, so this folder
> can live under `github-repo\` and still push to GitLab.

All commands below run in PowerShell (or the VS Code terminal) inside the project folder.

---

## 0. One-time setup

### Upgrade git (recommended)

Your git is 2.30 (from 2021). Upgrade so the defaults and the credential manager are current:

```powershell
winget upgrade --id Git.Git
git --version
```

### Tell git who you are

These values get stamped on every commit:

```powershell
git config --global user.name  "Chris Winters"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

> Privacy tip: both GitLab and GitHub offer a "no-reply" commit email (GitLab: *Preferences > Profile > Commit email*,
> GitHub: *Settings > Emails*). Use that if you don't want your real address in public history.

---

## 1. Authentication: pick ONE method

### Option A: SSH key (recommended: set up once, works for both GitLab and GitHub)

```powershell
ssh-keygen -t ed25519 -C "my-laptop"
# Press Enter to accept the default path (C:\Users\<you>\.ssh\id_ed25519)
# Choose a passphrase (recommended) or press Enter twice for none

Get-Content $HOME\.ssh\id_ed25519.pub | Set-Clipboard   # copies the PUBLIC key
```

- **GitLab:** avatar (top-left) > **Edit profile** > **SSH Keys** > **Add new key** > paste > *Add key*
- **GitHub:** avatar > **Settings** > **SSH and GPG keys** > **New SSH key** > paste > *Add SSH key*

Test it:

```powershell
ssh -T git@gitlab.com     # "Welcome to GitLab, @yourname!"
ssh -T git@github.com     # "Hi yourname! You've successfully authenticated..."
```

Type `yes` the first time when asked to trust the host fingerprint.

> Never share or commit `id_ed25519` (no `.pub`): that's the private key.

### Option B: HTTPS

Use `https://` remote URLs instead. On the first push, **Git Credential Manager** (bundled with Git for Windows) opens a
browser login window and stores the token in Windows Credential Manager. There are no keys to manage, but you'll see a popup once per host.

---

## 2. Create the empty projects (web UI)

### GitLab
1. https://gitlab.com > **New project** > **Create blank project**
2. Project name: `my-web-app`. Visibility: your choice (Private is fine, since Vercel/Azure can still deploy it).
3. **Uncheck "Initialize repository with a README"**. The repo must be empty, otherwise the first push is rejected.
4. **Create project.** GitLab shows the clone URL: `git@gitlab.com:<gitlab-user>/my-web-app.git`

### GitHub
1. https://github.com/new
2. Repository name: `my-web-app`. **Do not** add a README, .gitignore or license.
3. **Create repository.** URL: `git@github.com:<github-user>/my-web-app.git`

---

## 3. Connect the remotes and push

A "remote" is a named bookmark to a URL. We'll name them `gitlab` and `github` so it's obvious which is which:

```powershell
git remote add gitlab git@gitlab.com:<gitlab-user>/my-web-app.git
git remote add github git@github.com:<github-user>/my-web-app.git
git remote -v                    # list them to double-check
```

(Using HTTPS? Swap in `https://gitlab.com/<gitlab-user>/my-web-app.git` etc.)

First push (`-u` makes `gitlab/main` the default upstream, so a plain `git push` / `git pull` uses it):

```powershell
git push -u gitlab main
git push github main
```

Refresh the GitLab and GitHub pages and your code is there. On GitLab, go to **Build > Pipelines**: the `build` job
runs automatically (the `deploy_azure` job stays hidden until Azure is configured, see DEPLOY.md).

### Optional: one command pushes to both

Add both URLs as *push* targets of a single `origin` remote:

```powershell
git remote add origin git@gitlab.com:<gitlab-user>/my-web-app.git
git remote set-url --add --push origin git@gitlab.com:<gitlab-user>/my-web-app.git
git remote set-url --add --push origin git@github.com:<github-user>/my-web-app.git
git push -u origin main          # pushes to GitLab AND GitHub
```

`git pull` still fetches from GitLab only. Treat GitLab as the source of truth and GitHub as a mirror.

> Alternative: GitLab can mirror to GitHub for you (*Settings > Repository > Mirroring repositories*, push mirror
> with a GitHub personal access token). Then you only ever push to GitLab.

---

## 4. Daily loop

```powershell
git status                      # what changed?
git diff                        # show exact line changes
git add .                       # stage everything (or: git add path\to\file)
git commit -m "Describe the change"
git push                        # or: git push gitlab main ; git push github main
git log --oneline -10           # recent history
```

Pull changes made elsewhere, for example after editing a file in the GitLab web UI:

```powershell
git pull
```

## 5. Branches & Merge Requests (GitLab's name for Pull Requests)

```powershell
git switch -c feature/new-theme      # create + switch to a branch
# ...edit, commit...
git push -u gitlab feature/new-theme
```

GitLab prints a link to **create a merge request**. Open it, review the diff, and click **Merge**. Then locally:

```powershell
git switch main
git pull
git branch -d feature/new-theme      # delete the local branch
```

Vercel builds a **preview deployment** for every branch you push, so you get a live URL to test before merging.

## 6. Undo cheatsheet

| Situation                                      | Command                                  |
| ---------------------------------------------- | ---------------------------------------- |
| Discard unsaved edits to a file                | `git restore path\to\file`               |
| Unstage a file (keep the edits)                | `git restore --staged path\to\file`      |
| Fix the last commit message (not pushed yet)   | `git commit --amend -m "new message"`    |
| Undo a pushed commit safely (new reverse commit) | `git revert <commit-sha>`              |

Avoid `git push --force` on `main`. It rewrites history on the server.
