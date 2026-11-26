export const EXPLORER_BASE = 'https://hainahuang729.github.io/21cm-cosmic-dawn-atlas/';

export const EXPLORER_VIEWS = {
  main: {
    path: 'index.html',
    hash: '',
    label: '参数控制 · 21 cm 光锥 · UV LF · 全局演化与 τe',
  },
  mcmc: {
    path: 'index.html',
    hash: '#mcmc-section',
    label: '5×5 固定谱 LF-only 与 8D 联合 MCMC 归档',
  },
  walkers: {
    path: 'joint-repaired.html',
    hash: '#walker-traces',
    label: '交互式 Walker 轨迹与修复版 1000 步诊断',
  },
  park: {
    path: 'park-pl-comparison.html',
    hash: '',
    label: 'Park (2019) 与 MUV > −20 匹配 PL 联合对照',
  },
  mass: {
    path: 'lf-mass-response.html',
    hash: '',
    label: '10¹⁰ M☉ 暗晕质量–UV 星等参数响应',
  },
};

export function resolveExplorerUrl(viewKey, { base = EXPLORER_BASE, embed = true } = {}) {
  const key = Object.hasOwn(EXPLORER_VIEWS, viewKey) ? viewKey : 'main';
  const entry = EXPLORER_VIEWS[key];
  const url = new URL(entry.path, base);
  if (embed) url.searchParams.set('embed', '1');
  url.hash = entry.hash;
  return url.toString();
}

if (typeof document !== 'undefined') {
  const frame = document.getElementById('explorer-frame');
  const loading = document.getElementById('explorer-loading');
  const fallback = document.getElementById('explorer-fallback');
  const fallbackLink = document.getElementById('explorer-fallback-link');
  const externalLink = document.getElementById('explorer-external');
  const subtitle = document.getElementById('explorer-view-label');
  const buttons = [...document.querySelectorAll('.explorer-views [data-view]')];

  let timeoutId = null;
  const selectView = (rawKey, { updateHistory = true } = {}) => {
    const key = Object.hasOwn(EXPLORER_VIEWS, rawKey) ? rawKey : 'main';
    const view = EXPLORER_VIEWS[key];
    for (const btn of buttons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.view === key));
    }
    if (subtitle) subtitle.textContent = view.label;
    const extUrl = resolveExplorerUrl(key, { embed: false });
    if (externalLink) externalLink.href = extUrl;
    if (fallbackLink) fallbackLink.href = extUrl;

    if (loading) {
      loading.hidden = false;
      loading.classList.remove('is-hidden');
    }
    if (fallback) fallback.hidden = true;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (fallback && loading && !loading.classList.contains('is-hidden')) {
        fallback.hidden = false;
      }
    }, 12000);

    const embedUrl = resolveExplorerUrl(key, { embed: true });
    if (frame && frame.src !== embedUrl) {
      frame.src = embedUrl;
    }

    if (updateHistory) {
      const next = new URL(location.href);
      if (key === 'main') next.searchParams.delete('view');
      else next.searchParams.set('view', key);
      history.replaceState(null, '', next);
    }
  };

  if (frame) {
    frame.addEventListener('load', () => {
      clearTimeout(timeoutId);
      if (loading) {
        loading.classList.add('is-hidden');
        loading.hidden = true;
      }
      if (fallback) fallback.hidden = true;
    });
  }

  for (const btn of buttons) {
    btn.addEventListener('click', () => selectView(btn.dataset.view));
  }

  const initialView = new URLSearchParams(location.search).get('view') || 'main';
  selectView(initialView, { updateHistory: false });
}
