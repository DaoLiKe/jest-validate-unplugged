# 推送到 GitHub（DaoLiKe/jest-validate-study）

本仓库是 **jestjs/jest** 中 `jest-validate` 模块的学习性「署名派生」：
- 原始 MIT License（Meta Platforms 版权）已逐字保留 → `LICENSE`
- 署名与学习用途声明 → `ATTRIBUTION.md`
- 零依赖重构范本 + 代码坏味道讲解 → `src/`、`STUDY_GUIDE.md`

合规原则：**保留原作者版权与许可，不冒充原创，仅作团队学习之用。**

## 方式 A：让我（Senior Developer）用 GitHub API 推送
适用：你希望我直接完成，无需本地操作。
1. 在 GitHub 生成一个 **Classic Personal Access Token**，勾选 `repo` 权限（以及 `read:user`）。
   - 路径：GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token。
2. 把 token 粘贴给我（推送完成后建议你立即在 GitHub 撤销该 token）。
3. 我会通过 GitHub REST Contents API 把 16 个文件逐个创建到 `DaoLiKe/jest-validate-study`，每个文件独立提交，规避单次大 payload 的 `400` 限制。

## 方式 B：你自己本地一键推送
适用：你本地已 `gh auth login` 或 git 凭据已缓存。

Git Bash / WSL：
```bash
cd /path/to/jest-validate-study
bash push.sh
```

Windows CMD：
```bat
cd D:\deepseek\WB\jest-validate-study
push.bat
```

脚本会自动 `git init` → 提交 → 用 `gh repo create` 建库并推送（若 `gh` 不可用则回退到 `git push`）。
