@echo off
REM One-command local push for jest-validate-unplugged -> github.com/DaoLiKe/jest-validate-unplugged
REM Run on YOUR machine (Windows CMD) where `gh` is authed OR git credentials are cached.
cd /d %~dp0

set OWNER=DaoLiKe
set REPO=jest-validate-unplugged
set BRANCH=main

git init
git checkout -b %BRANCH% 2>nul || git checkout %BRANCH%
git config user.email "dev@example.com"
git config user.name "DaoLiKe"
git add -A
git commit -m "Initial commit: jest-validate study (attributed derivative of jestjs/jest)" || echo (nothing to commit)

where gh >nul 2>nul && (
  echo ==^> gh detected - creating repo + pushing...
  gh repo create %OWNER%/%REPO% --public --source=. --remote=origin --push && goto :done
)

git remote add origin https://github.com/%OWNER%/%REPO%.git 2>nul || git remote set-url origin https://github.com/%OWNER%/%REPO%.git
git push -u origin %BRANCH%

:done
echo ==^> Done: https://github.com/%OWNER%/%REPO%
