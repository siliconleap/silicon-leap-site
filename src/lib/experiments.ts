import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from '../i18n/ui';

export type Experiment = CollectionEntry<'experiments'>;

/** entry.id 形如 "zh/2026-08-workbuddy"，拆成语言和 slug。 */
export function splitId(entry: Experiment): { lang: Lang; slug: string } {
  const [lang, ...rest] = entry.id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

async function published(): Promise<Experiment[]> {
  return getCollection('experiments', ({ data }) => import.meta.env.DEV || !data.draft);
}

/**
 * 按 slug 归并出所有实验：每个 slug 记录它有哪些语言版本。
 * 这是双语切换的唯一事实来源——路由生成和切换按钮都读它，避免两边判断不一致。
 */
export async function experimentIndex() {
  const all = await published();
  const bySlug = new Map<string, Partial<Record<Lang, Experiment>>>();

  for (const entry of all) {
    const { lang, slug } = splitId(entry);
    if (!slug) continue;
    const bucket = bySlug.get(slug) ?? {};
    bucket[lang] = entry;
    bySlug.set(slug, bucket);
  }

  return bySlug;
}

/**
 * 某个语言下要渲染的实验列表。
 * 没有该语言版本时回落到默认语言的条目——Astro 的 i18n.fallback 只作用于
 * src/pages 下的文件路由，动态路由必须在这里自己处理。
 */
export async function experimentsFor(lang: Lang) {
  const index = await experimentIndex();
  const items = [];

  for (const [slug, versions] of index) {
    const entry = versions[lang] ?? versions[defaultLang];
    if (!entry) continue;
    items.push({
      slug,
      entry,
      /** true 表示这个语言其实没有原生版本，展示的是回落内容 */
      isFallback: !versions[lang],
      hasTranslation: Boolean(versions[lang === 'zh' ? 'en' : 'zh']),
    });
  }

  return items.sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime());
}
