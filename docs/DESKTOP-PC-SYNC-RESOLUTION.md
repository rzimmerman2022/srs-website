# Desktop PC Git Sync Resolution Guide

**Created:** 2025-12-28 03:50 PST
**Issue:** Desktop PC unable to pull/fetch from main due to conflicts
**Current main HEAD:** `e1ecfcf` (Correct branch status accuracy in documentation)

---

## Step 1: Diagnose the Issue on Desktop PC

Open terminal on your **Desktop PC** and run:

```bash
cd "/path/to/SRS - Website"  # Adjust to your actual path
git status
git fetch origin
git log --oneline -5
git branch -a
```

**Copy and save the output** - this will tell us exactly what's wrong.

---

## Step 2: Common Issue #1 - Uncommitted Changes

**If `git status` shows modified files:**

```bash
# Option A: Save your changes and apply later
git stash save "Desktop PC changes before sync $(date)"

# Option B: Commit your changes first
git add .
git commit -m "WIP: Desktop PC uncommitted changes"

# Then pull
git pull origin main
```

---

## Step 3: Common Issue #2 - Diverged Branches

**If you see "Your branch and 'origin/main' have diverged":**

```bash
# See what commits are different
git log --oneline main..origin/main  # What's on remote but not local
git log --oneline origin/main..main  # What's on local but not remote

# Option A: Remote is correct (RECOMMENDED - we did all work here)
git fetch origin
git reset --hard origin/main

# CAUTION: This discards local commits. Make sure you don't have important work!
# If unsure, first backup:
git branch backup-desktop-$(date +%Y%m%d)

# Then reset
git reset --hard origin/main
```

---

## Step 4: Common Issue #3 - Conflicting Files

**If you see specific file conflicts:**

```bash
# Check which files are causing issues
git diff main origin/main --name-only

# If conflicts are in documentation files ONLY:
git fetch origin
git checkout origin/main -- docs/
git checkout origin/main -- PROGRESS*.md
git checkout origin/main -- state/

# Then try pull again
git pull origin main
```

---

## Step 5: Nuclear Option - Fresh Start (If Nothing Else Works)

**ONLY if you have no important uncommitted work on desktop:**

```bash
# 1. Backup your entire project folder first!
cp -r "/path/to/SRS - Website" "/path/to/SRS - Website.backup"

# 2. Inside the project, reset everything
git fetch origin
git reset --hard origin/main
git clean -fdx  # CAUTION: Deletes ALL untracked files!

# 3. Verify
git status  # Should say "nothing to commit, working tree clean"
git log --oneline -3  # Should show:
# e1ecfcf docs: Correct branch status accuracy in documentation
# b9e649b docs: Add 9 critical security vulnerabilities...
# af5ea34 docs: Complete Session 3 handoff documentation...
```

---

## Step 6: Clean Up Stale Branches (After Sync Successful)

```bash
# Delete local staging branch (15 commits behind, 0 ahead)
git branch -D staging/seo-content-drafts

# Delete remote branches (optional)
git push origin --delete staging/seo-content-drafts
git push origin --delete feature/hubspot-integration

# Clean up remote tracking branches
git fetch origin --prune
```

---

## Expected Final State

After successful sync, you should have:

```bash
$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean

$ git log --oneline -5
e1ecfcf docs: Correct branch status accuracy in documentation
b9e649b docs: Add 9 critical security vulnerabilities and production bugs to documentation
af5ea34 docs: Complete Session 3 handoff documentation with state serialization
406945c docs: Update Master To-Do List for Session 3 (HubSpot + TOC deployment)
f919e37 chore: Remove Supabase temp artifacts and add to gitignore

$ git branch -a
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/main
```

---

## Troubleshooting Specific Error Messages

### Error: "Your local changes would be overwritten by merge"

**Files affected:** `.claude/settings.local.json`, `app/privacy/page.tsx`, `app/terms/page.tsx`, or documentation files

**Solution:**
```bash
# These files have been updated on main, safe to discard local changes
git checkout origin/main -- .claude/settings.local.json
git checkout origin/main -- app/privacy/page.tsx
git checkout origin/main -- app/terms/page.tsx
git checkout origin/main -- docs/
git pull origin main
```

### Error: "fatal: refusing to merge unrelated histories"

```bash
git pull origin main --allow-unrelated-histories
```

### Error: "Authentication failed" or "Permission denied"

```bash
# Verify your GitHub credentials
git config user.name
git config user.email

# If using SSH, test connection
ssh -T git@github.com

# If using HTTPS, you may need to update token
git remote -v  # Check your remote URL
```

---

## Files Modified in Last 3 Commits (What Changed on Main)

**Commit e1ecfcf (Latest):**
- `docs/MASTER-TODO-LIST.md` - Updated branch status (15 commits behind)
- `docs/handoffs/HANDOFF_2025-12-28_03-18-36_Sonnet-4.5_hubspot-toc-deployment.md` - Added GOTCHA 4

**Commit b9e649b:**
- `docs/MASTER-TODO-LIST.md` - Added 9 critical security issues
- `docs/handoffs/HANDOFF_2025-12-28_03-18-36_Sonnet-4.5_hubspot-toc-deployment.md` - Added SECURITY WARNING 0

**Commit af5ea34:**
- `PROGRESS_2025-12-28_03-18-36_Sonnet-4.5_hubspot-toc-deployment.md` - New file
- `docs/handoffs/HANDOFF_2025-12-28_03-18-36_Sonnet-4.5_hubspot-toc-deployment.md` - New file
- `state/session_2025-12-28_03-18-36_Sonnet-4.5.json` - New file
- `.claude/settings.local.json` - Updated permissions

**All changes are documentation-only** - no production code was modified in these 3 commits.

---

## If You Need Help

**Provide this information:**

1. Output of `git status` from desktop PC
2. Output of `git log --oneline -10` from desktop PC
3. Which step you tried and what error you got
4. Whether you have any uncommitted work you need to keep

**Safe to discard on desktop PC:**
- Any changes to `.claude/settings.local.json`
- Any changes to `app/privacy/page.tsx` or `app/terms/page.tsx`
- Any changes to files in `docs/` folder
- Anything in `PROGRESS_*.md` or `state/` folder

**Be careful with:**
- Any actual code changes you made to components or pages
- Any `.env` or configuration files you modified
- Any new features or bug fixes you worked on

---

## Quick Decision Tree

```
Can't pull from main?
│
├─ Do you have uncommitted changes?
│  ├─ Yes → git stash or git commit first
│  └─ No → Continue
│
├─ Do you have commits not on remote?
│  ├─ Yes → Are they important?
│  │  ├─ Yes → git push them first or create backup branch
│  │  └─ No → git reset --hard origin/main
│  └─ No → Continue
│
├─ Are there file conflicts?
│  ├─ Documentation files → Safe to overwrite with origin/main
│  └─ Code files → Review carefully, may need manual merge
│
└─ Still stuck? → Nuclear option (Step 5) after backup
```

---

**Generated:** 2025-12-28 03:50 PST
**For:** Desktop PC sync issues with main branch
**Safe to delete this file after resolution**
