History purge guide

This document explains how to safely remove sensitive files (for example `config/.env`) from git history using `git-filter-repo`.

Important notes
- This rewrites repository history. Every collaborator who has clones will need to re-clone or reset their local clones.
- BACKUP your repository before proceeding: create a mirror clone or tar the repo.
- Do NOT force-push until you have communicated with all collaborators.

Quick summary (safe approach)
1. Prepare a mirror clone and run the filter locally (no remote push):

   ./scripts/prepare-history-purge.sh --paths config/.env

2. Inspect the rewritten mirror repository in the printed mirror directory. If satisfied, coordinate with collaborators and then force-push the rewritten refs:

   cd <mirror>/repo.git
   git push --force --all origin
   git push --force --tags origin

Detailed steps

1) Install git-filter-repo
- On macOS (Homebrew):
  brew install git-filter-repo
- From source / pip: see https://github.com/newren/git-filter-repo#installing

2) Create a mirror clone and run the filter (dry-run)

```bash
# from your local machine
git clone --mirror git@github.com:your/repo.git mirror-repo.git
cd mirror-repo.git
# Remove config/.env from history (rewrites inside this mirror)
git filter-repo --invert-paths --path config/.env
# Inspect the mirror: check logs, file presence, tags, and branches
```

3) Inspect and validate
- Verify that the sensitive file is gone from history:
  git --no-pager log --all --pretty=oneline | grep "config/.env" || echo "no matches"
- Verify branches and tags are intact.

4) Coordinate and push
- Notify collaborators and schedule a time to push the rewritten history.
- Force-push:
  git push --force --all origin
  git push --force --tags origin

5) Post-purge actions
- Rotate credentials (if not already done).
- Ask collaborators to reclone or run appropriate local history-repair commands.

If you'd like, I can:
- Run the mirror creation and filter here and provide the mirror for you to inspect (I will NOT force-push to origin without your explicit instruction).
- Produce a one-click script that runs `git-filter-repo` and then, after your confirmation, performs the force-push.

