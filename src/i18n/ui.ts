export const languages = {
  zh: '中文',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'zh';

export const ui = {
  zh: {
    'site.title': '硅基跃迁',
    'site.tagline': '一组关于 AI 原生软件构建方式的持续实验。',
    'nav.home': '首页',
    'nav.experiments': '实验',
    'exp.index.title': '实验',
    'exp.question': '问题',
    'exp.empty': '还没有已发布的实验。',
    'lang.noTranslation': '暂无英文版',
    'lang.switchTo': 'English',
    'back': '← 返回实验列表',
  },
  en: {
    'site.title': 'Silicon Leap',
    'site.tagline': 'An ongoing set of experiments on AI-native software building.',
    'nav.home': 'Home',
    'nav.experiments': 'Experiments',
    'exp.index.title': 'Experiments',
    'exp.question': 'Question',
    'exp.empty': 'No published experiments yet.',
    'lang.noTranslation': 'No Chinese version',
    'lang.switchTo': '中文',
    'back': '← Back to experiments',
  },
} as const;

export function t(lang: Lang) {
  return function (key: keyof (typeof ui)['zh']): string {
    return (ui[lang] as Record<string, string>)[key] ?? (ui[defaultLang] as Record<string, string>)[key];
  };
}

/** 给定语言，拼出带（或不带）前缀的站内路径。 */
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean}`;
}
