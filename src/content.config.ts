import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 实验记录。目录结构：src/content/experiments/<lang>/<slug>.md
// 同一个 slug 在 zh/ 和 en/ 下各有一份 = 双语；只在 zh/ 下 = 仅中文。
const experiments = defineCollection({
  loader: glob({ base: './src/content/experiments', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    // 一句话说明这次实验在问什么
    question: z.string(),
    date: z.coerce.date(),
    // 草稿不参与生产构建
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
  }),
});

export const collections = { experiments };
