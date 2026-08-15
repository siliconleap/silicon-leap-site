# Silicon Leap Site

硅基跃迁的公开站点。内容源是 Markdown，由 [`silicon-leap-forge`](../silicon-leap-forge) 的
`content-forge` 流水线产出后放进 `src/content/`。

技术栈：Astro 5（静态输出）+ Cloudflare Pages。无框架、无客户端 JS。

## 内容组织

```
src/content/experiments/
  zh/<slug>.md      中文版
  en/<slug>.md      英文版（可选）
```

**同一个 slug 在两种语言下各有一份 = 双语，页面上出现语言切换按钮。**
只有 `zh/` 下有 = 仅中文，切换按钮置灰显示"暂无英文版"，并且**不会**生成
`/en/experiments/<slug>` 这种点进去还是中文的假英文页。

中文是基础语言：只放在 `en/` 下、没有中文对应版本的文件不会出现在中文站上。

URL 规则：中文不带前缀（`/experiments/foo`），英文带 `/en` 前缀（`/en/experiments/foo`）。

frontmatter 字段见 `src/content.config.ts`，写错字段构建会直接失败。

> 实现说明：Astro 的 `i18n.fallback` 只对 `src/pages` 下的文件路由生效，对
> `getStaticPaths` 生成的动态路由不自动生效。所以语言回落逻辑显式写在
> `src/lib/experiments.ts` 里，路由生成和切换按钮共用这一个判断，不会出现两边不一致。

## 本地开发

```bash
npm install
npm run dev      # 开发预览：http://localhost:4321
npm run check    # Astro/TypeScript 检查
npm run build    # 生产构建，输出到 dist/
```

`draft: true` 的条目在 `dev` 下可见，`build` 时排除。

## 预览与发布

日常改内容或样式时，可以先用本地开发服务器：

```bash
npm run dev
```

提交前建议本地跑一次检查和生产构建：

```bash
npm run check
npm run build
```

如果要在本地看生产构建产物，再运行：

```bash
npm run preview
```

更推荐的发布前预览流程是走真实环境：

1. 新建内容分支，例如 `content/2026-08-new-experiment`；或由 `siliconleap/silicon-leap-lab` 的 `Publish Site Draft` Action 自动创建 site PR
2. 提交并 push 到 GitHub
3. GitHub Actions 会运行 `.github/workflows/cloudflare-pages.yml`
4. Action 通过后，Cloudflare Pages 会生成这个分支对应的公网 preview URL
5. 检查 preview URL 没问题后，再合并到主分支发布正式站点

发布前建议检查首页、实验列表、至少一篇中文文章、一篇英文文章，以及只有中文版本的文章语言切换是否置灰。

## 部署到 Cloudflare Pages

这个仓库用 GitHub Actions 部署 Cloudflare Pages，不依赖 Cloudflare Dashboard 的 Git 集成。

1. 在 Cloudflare Pages 创建项目，记录项目名和 Account ID
2. 创建 Cloudflare API Token，至少需要 Cloudflare Pages 部署权限
3. 在 GitHub 仓库 `siliconleap/silicon-leap-site` 配置：
   - Secret `CLOUDFLARE_API_TOKEN`
   - Secret `CLOUDFLARE_ACCOUNT_ID`
   - Variable `CLOUDFLARE_PAGES_PROJECT_NAME`
4. 在 Cloudflare Pages 项目设置里确认 production branch（通常是 `main`）
5. push 到非 production branch 会生成分支 preview 部署
6. push 或合并到 production branch 会更新生产部署
7. 绑定自定义域名后，把 `astro.config.mjs` 里的 `site` 改成正式域名
   （它决定 canonical 和 hreflang 的绝对地址）

## 还没做

- RSS（加 `@astrojs/rss`）
- 按 `Accept-Language` 自动跳转语言（`functions/_middleware.ts`）
- 站内搜索、OG 图生成、标签页
