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
npm run dev      # http://localhost:4321
npm run build    # 输出到 dist/
```

`draft: true` 的条目在 `dev` 下可见，`build` 时排除。

## 部署到 Cloudflare Pages

1. 把本目录推到一个 GitHub 仓库
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → 连接该仓库
3. 构建配置：
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - 环境变量 `NODE_VERSION` = `22`（或更高）
4. 绑定自定义域名后，把 `astro.config.mjs` 里的 `site` 改成正式域名
   （它决定 canonical 和 hreflang 的绝对地址）

每个 PR 会自动生成 preview 部署，push 到主分支即上线。

## 还没做

- RSS（加 `@astrojs/rss`）
- 按 `Accept-Language` 自动跳转语言（`functions/_middleware.ts`）
- 站内搜索、OG 图生成、标签页
