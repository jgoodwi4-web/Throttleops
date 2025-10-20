#!/usr/bin/env bash
# Safe helper to prepare and optionally run git-filter-repo to remove paths from history.
# DEFAULT BEHAVIOR: dry-run — creates a mirror clone and prints the exact commands to run.
# WARNING: Running this script with --execute will rewrite history locally in the mirror clone.
# DO NOT push the rewritten history unless you understand the implications and have coordinated with collaborators.

set -euo pipefail

# Defaults
PATHS_TO_REMOVE=("config/.env")
MIRROR_DIR=""
EXECUTE=0
FORCE_PUSH=0

usage() {
  cat <<EOF
Usage: $(basename "$0") [--paths path1,path2] [--execute] [--force-push]

Options:
  --paths   Comma-separated list of paths to remove from history (default: config/.env)
  --execute Actually run git-filter-repo in the mirror clone (otherwise this script only prepares the mirror and prints commands)
  --force-push  After running git-filter-repo, also force-push the rewritten refs to origin (REQUIRES interactive confirmation)

Examples:
  # Prepare a mirror and show commands (safe)
  ./scripts/prepare-history-purge.sh

  # Prepare and run filter locally in the mirror (but do NOT push)
  ./scripts/prepare-history-purge.sh --paths config/.env,web/.env --execute

  # WARNING: Run and force-push (only after explicit coordination)
  ./scripts/prepare-history-purge.sh --execute --force-push
EOF
}

if [ "$#" -gt 0 ]; then
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --paths)
        shift
        IFS=',' read -r -a PATHS_TO_REMOVE <<< "$1"
        ;;
      --execute)
        EXECUTE=1
        ;;
      --force-push)
        FORCE_PUSH=1
        ;;
      --help|-h)
        usage
        exit 0
        ;;
      *)
        echo "Unknown arg: $1" >&2
        usage
        exit 2
        ;;
    esac
    shift || true
  done
fi

if ! command -v git >/dev/null 2>&1; then
  echo "git not found in PATH" >&2
  exit 1
fi

if [ $EXECUTE -eq 1 ] && ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "git-filter-repo not found. Install it before running with --execute." >&2
  echo "See: https://github.com/newren/git-filter-repo#installing"
  exit 1
fi

REPO_URL=$(git config --get remote.origin.url || true)
if [ -z "$REPO_URL" ]; then
  echo "No origin remote found. Please run this from a clone with an 'origin' remote." >&2
  exit 1
fi

MIRROR_DIR=$(mktemp -d -t repo-mirror-XXXX)
echo "Created mirror directory: $MIRROR_DIR"

echo "Cloning mirror..."
git clone --mirror "$REPO_URL" "$MIRROR_DIR/repo.git"

echo
echo "Paths to remove from history:"
for p in "${PATHS_TO_REMOVE[@]}"; do
  echo "  - $p"
done

FILTER_CMD="git filter-repo --invert-paths"
for p in "${PATHS_TO_REMOVE[@]}"; do
  FILTER_CMD+=" --path $p"
done

cat <<MSG
Dry-run summary
----------------
Mirror clone location: $MIRROR_DIR/repo.git
To run the filter in the mirror (this will rewrite history in the mirror only):

  cd $MIRROR_DIR/repo.git
  $FILTER_CMD

After running the filter you should inspect the mirror repository carefully. If you are satisfied, the force-push commands are:

  # WARNING: This will rewrite the remote history for all refs. Coordinate with collaborators.
  cd $MIRROR_DIR/repo.git
  git push --force --all origin
  git push --force --tags origin

MSG

if [ $EXECUTE -eq 1 ]; then
  echo
  echo "Running filter-repo in mirror now..."
  pushd "$MIRROR_DIR/repo.git" >/dev/null
  # Run the filter
  eval "$FILTER_CMD"
  echo "Filter ran. Run the following to inspect the rewritten repository:" 
  echo "  git --no-pager log --all --pretty=oneline | head -n 20"
  popd >/dev/null

  if [ $FORCE_PUSH -eq 1 ]; then
    echo
    read -rp "You requested --force-push. Are you absolutely sure you want to push the rewritten history to origin? (yes to proceed): " CONFIRM
    if [ "$CONFIRM" = "yes" ]; then
      echo "Pushing rewritten refs to origin (this will force-push)..."
      pushd "$MIRROR_DIR/repo.git" >/dev/null
      git push --force --all origin
      git push --force --tags origin
      popd >/dev/null
      echo "Force-push complete. Note: collaborators will need to reclone or reset their clones." 
    else
      echo "Force-push aborted by user. The mirror contains the rewritten history in: $MIRROR_DIR/repo.git"
    fi
  else
    echo "--force-push not set. Mirror contains the rewritten history in: $MIRROR_DIR/repo.git"
  fi
else
  echo
  echo "Dry-run only. No history was rewritten. The mirror clone is available at: $MIRROR_DIR/repo.git"
  echo "To run the filter for real, re-run this script with --execute (and optionally --force-push after coordination)."
fi

exit 0
