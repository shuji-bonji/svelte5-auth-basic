import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {};
};

// 認証が必要なページはプリレンダリングを無効化
export const prerender = false;
export const ssr = true;