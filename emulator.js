export const EMULATOR_BASE = 'https://hainahuang729.github.io/21cm-reionization-emulator/';

export const EMULATOR_VIEWS = {
  overview: {
    path: 'index.html',
    hash: '',
    label: 'PSX-emu v1.0 · 100k 再电离与 21 cm 功率谱模拟器概览',
  },
  data: {
    path: 'index.html',
    hash: '#data-analysis',
    label: '训练样本覆盖、PCA 表征与参数关联分析',
  },
  validation: {
    path: 'index.html',
    hash: '#models-section',
    label: '模型验证边界、4 项 ARD-GP 补丁与学习曲线',
  },
  random_ic: {
    path: 'random-ic-analysis.html',
    hash: '',
    label: '随机初始条件（Random IC）独立分析图集',
  },
};

export function resolveEmulatorUrl(viewKey, { base = EMULATOR_BASE, embed = true } = {}) {
  const key = Object.hasOwn(EMULATOR_VIEWS, viewKey) ? viewKey : 'overview';
  const entry = EMULATOR_VIEWS[key];
  const url = new URL(entry.path, base);
  if (embed) url.searchParams.set('embed', '1');
  url.hash = entry.hash;
  return url.toString();
}

if (typeof document !== 'undefined') {
  const frame = document.getElementById('emulator-frame');
  const loading = document.getElementById('emulator-loading');
  const fallback = document.getElementById('emulator-fallback');
  const fallbackLink = document.getElementById('emulator-fallback-link');
  const externalLink = document.getElementById('emulator-external');
  const subtitle = document.getElementById('emulator-view-label');
  const buttons = [...document.querySelectorAll('.emulator-views [data-view]')];

  let timeoutId = null;
  const selectView = (rawKey, { updateHistory = true } = {}) => {
    const key = Object.hasOwn(EMULATOR_VIEWS, rawKey) ? rawKey : 'overview';
    const view = EMULATOR_VIEWS[key];
    for (const btn of buttons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.view === key));
    }
    if (subtitle) subtitle.textContent = view.label;
    const extUrl = resolveEmulatorUrl(key, { embed: false });
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

    const embedUrl = resolveEmulatorUrl(key, { embed: true });
    if (frame && frame.src !== embedUrl) {
      frame.src = embedUrl;
    }

    if (updateHistory) {
      const next = new URL(location.href);
      if (key === 'overview') next.searchParams.delete('view');
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

  const initialView = new URLSearchParams(location.search).get('view') || 'overview';
  selectView(initialView, { updateHistory: false });
}
