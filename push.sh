#!/usr/bin/env bash
# One-command local push for jest-validate-study -> github.com/DaoLiKe/jest-validate-study
# Run on YOUR machine (Git Bash / WSL / any bash) where `gh` is authed OR git credentials are cached.
set -euo pipefail
cd "$(dirname "$0")"

OWNER="DaoLiKe"
REPO="jest-validate-unplugged"
BRANCH="main"
COMMIT_MSG="Initial commit: jest-validate study (attributed derivative of jestjs/jest)

Zero-dependency study refactor of the jest-validate module for team learning.
Original MIT License (Meta Platforms) and authorship preserved. See ATTRIBUTION.md."

git init -q
git symbolic-ref HEAD "refs/heads/$BRANCH" 2>/dev/null || git checkout -q "$BRANCH"
git config user.email "${GIT_AUTHOR_EMAIL:-dev@example.com}"
git config user.name  "${GIT_AUTHOR_NAME:-DaoLiKe}"
git add -A
git commit -q -m "$COMMIT_MSG" || echo "(nothing new to commit)"

# Preferred: gh creates the repo AND pushes in one shot (uses your existing gh auth)
if command -v gh >/dev/null 2>&1; then
  echo "==> gh detected — creating repo + pushing..."
  if gh repo create "$OWNER/$REPO" --public --source=. --remote=origin --push; then
    echo "==> Done: https://github.com/$OWNER/$REPO"
    exit 0
  fi
  echo "   (gh repo create failed or repo exists — falling back to plain git push)"
fi

# Fallback: manual remote + push (you'll be prompted for username / token)
git remote add origin "https://github.com/$OWNER/$REPO.git" 2>/dev/null \
  || git remote set-url origin "https://github.com/$OWNER/$REPO.git"
git push -u origin "$BRANCH"
echo "==> Done: https://github.com/$OWNER/$REPO"
