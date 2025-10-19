#!/usr/bin/env bash
# Safe helper to remove `config/.env` from git history using git-filter-repo.
# This script does NOT run a force-push. It prepares a mirror clone and shows the
# commands to run. Read the comments before using.

set -euo pipefail

echo "This script prepares a mirror clone and demonstrates how to remove 'config/.env' from history."
echo
echo "Prerequisites: install git-filter-repo (https://github.com/newren/git-filter-repo)" 
echo "DO NOT run this script unless you've backed up your repo and coordinated with collaborators."
echo
REPO_URL=$(git config --get remote.origin.url || true)
if [ -z "$REPO_URL" ]; then
  echo "No origin remote found. Please run from a clone with an 'origin' remote." >&2
  exit 1
fi

TMPDIR=$(mktemp -d)
echo "Creating mirror clone in $TMPDIR"
git clone --mirror "$REPO_URL" "$TMPDIR/repo.git"
echo
cat <<'INSTR'
Now run the following inside the mirror clone to remove the file from history:

  cd <mirror>/repo.git
  # Replace <path-to-remove> with 'config/.env' in this repo
  git filter-repo --invert-paths --path config/.env

This will rewrite history. Inspect the repository and only then force-push:

  git push --force

Important: Force-pushing rewrites history for all collaborators. Coordinate and backup.

If you want the BFG tool instead, see: https://rtyley.github.io/bfg-repo-cleaner/
INSTR

echo
echo "Mirror created at: $TMPDIR/repo.git"
echo "Script finished. Follow the printed instructions to complete the purge."
