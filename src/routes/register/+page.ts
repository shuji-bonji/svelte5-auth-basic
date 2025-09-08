import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {};
};

// Form Actionsを使用するページはプリレンダリングを無効化
export const prerender = false;
export const ssr = true;