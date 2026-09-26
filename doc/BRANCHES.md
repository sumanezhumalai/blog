# Repository & Branch Reference

> Last updated: 2026-09-27 — after `quattrodots` → `rc` rename and GitHub origin setup.

## 1. Remote

| Key | Value |
| :--- | :--- |
| **GitHub Repo** | `sumanezhumalai/blog` |
| **SSH URL (origin)** | `git@github.com:sumanezhumalai/blog.git` |
| **HTTPS URL** | `https://github.com/sumanezhumalai/blog.git` |
| **Remote name** | `origin` |
| **Default remote HEAD** | `origin/main` (`refs/remotes/origin/HEAD -> origin/main`) |

Setup command used:
```bash
git remote add origin git@github.com:sumanezhumalai/blog.git
```

Verify:
```bash
git remote -v
git ls-remote --symref origin HEAD
```

## 2. Branches

### `main` — stable / production

* Created from current code at `be83406` (`refactor(pre-astro): vanilla JS rewrite`).
* Commands used:
  ```bash
  git branch main          # creates main at HEAD (same commit as rc)
  git push -u origin main  # first push, sets upstream origin/main
  ```
* Tracks `origin/main` (`branch 'main' set up to track 'origin/main'`).
* Intended use: production-ready, deployable, protected on GitHub.

### `rc` — release candidate / development

* Renamed from `quattrodots` → `rc`:
  ```bash
  git branch -m quattrodots rc   # non-destructive local rename
  git config init.defaultBranch rc  # updates local default for future `git init`
  ```
* Result: `.git/HEAD` now `ref: refs/heads/rc`, `.git/refs/heads/quattrodots` → `.git/refs/heads/rc`.
* Commit history unchanged — 6 linear commits (`2ccc164` → `be83406`).
* Currently identical to `main` (both at `be83406`), but will diverge as development continues.
* Intended use: active development, pre-flight checks before merging to `main`.

### Branch graph (2026-09-27)

```
* be83406 (HEAD -> rc, main, origin/main, origin/HEAD) refactor(pre-astro): vanilla JS rewrite
* 7d2b694 feat(meta): update index.html and main.css
* a8e1d86 docs: add starter template refactoring guide
* 9e3217b fix(styles): make page-not-found selector generic
* b4cfea7 refactor: cleanup to clean blog template
* 2ccc164 chore: initial commit — reference portfolio state
```

## 3. Why rename is non-destructive

* `git branch -m` only renames the ref file; SHA-1 hashes, reflog, working tree, and index are untouched.
* No remote existed before rename, so no remote-tracking collision.
* No existing `rc` ref existed (`git show-ref | grep rc` was empty), so `-m` is safe (`-M` would have been destructive if collision).
* No code references `quattrodots` (`grep -r quattrodots --exclude-dir=.git` → empty).

## 4. Common commands

```bash
# switch branches
git switch main
git switch rc

# update main from rc
git switch main
git merge rc
git push origin main

# push rc (when ready to backup rc remotely)
git push -u origin rc

# view all branches
git branch -a
git log --oneline --graph --all --decorate
```

## 5. Related docs

* `doc/README.md` — Template refactoring & architecture guide (sections 1-5)
* This file — `doc/BRANCHES.md` — Git & branch reference (added 2026-09-27)
