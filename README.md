# jest-validate 研读 · 团队代码质量练习

> 基于 [jestjs/jest](https://github.com/jestjs/jest) 的 `jest-validate` 模块（MIT, Meta）所做的学习型重构仓库。
> 这是一份**署名派生（attributed derivative）**作品，用于团队提升对测试框架代码的审美与重构能力。

## 这个仓库是什么

| 目录 / 文件 | 说明 |
| --- | --- |
| `original/` | Jest 原始 `jest-validate` 源码（逐字副本），方便对比研读 |
| `src/` | 我们做的**零依赖、可直跑**重构版，带大量中文注解，标注代码质量改进点 |
| `STUDY_GUIDE.md` | 架构讲解 + 发现的代码坏味道 + 重构思路 + 可落地的团队规范建议 |
| `examples/usage.js` | 零依赖可运行演示 |

## 为什么这样处理（合规说明）

1. **保留原作者版权与 MIT License**，未剥离任何署名。
2. 把上游 TypeScript + 4 个外部依赖（`chalk` / `leven` / `pretty-format` / `@jest/get-type`）
   改写为**零依赖纯 JS**，便于团队无需 `npm install` 即可运行、单测、做重构练习。
3. 这是对开源作品的**正当「学习性使用」**，完全符合 MIT License 的精神与条款。

## 运行

```bash
node examples/usage.js
```

无需安装任何依赖（零依赖）。设置 `NO_COLOR=1` 可关闭终端颜色。

## 推荐学习路径

1. 先读 `original/validate.ts` 与 `original/utils.ts`，建立对原始实现的直观认识。
2. 再读 `src/validate.js` 与 `src/errors.js`，对照 `STUDY_GUIDE.md` 里的「改进点 ①~④」。
3. 运行 `examples/usage.js`，观察重构后的模块行为是否与原版一致。
4. 团队成员各自挑一个 `src/` 文件做二次重构，提交 PR 互相评审——把「代码质量把控」落到实操。
