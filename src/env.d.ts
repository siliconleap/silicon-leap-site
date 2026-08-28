/// <reference types="astro/client" />

// Waline 的样式入口没有随包提供类型声明，动态 import 时补一个。
declare module '@waline/client/style';

interface ImportMetaEnv {
  /** Waline 服务端地址；不配置则不渲染评论区 */
  readonly PUBLIC_WALINE_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
