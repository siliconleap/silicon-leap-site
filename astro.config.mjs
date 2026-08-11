// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://siliconleap.pages.dev',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      // 中文是默认语言，不带前缀：/experiments/xxx
      // 英文带前缀：/en/experiments/xxx
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
