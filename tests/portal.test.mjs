import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { EXPLORER_BASE, EXPLORER_VIEWS, resolveExplorerUrl } from '../explorer.js';

const root = new URL('../', import.meta.url);
const readText = (name) => readFile(new URL(name, root), 'utf8');

test('index forwards search and hash directly to cavity.html', async () => {
  const indexHtml = await readText('index.html');
  assert.match(indexHtml, /location\.replace\(['"]\.\/cavity\.html['"]\+location\.search\+location\.hash\)/);
});

test('all three portal pages expose unified 3D / 2D / 1D navigation with distinct aria-current', async () => {
  const [cavity, atlas, explorer] = await Promise.all([
    readText('cavity.html'),
    readText('atlas.html'),
    readText('explorer.html'),
  ]);
  assert.match(cavity, /href="\.\/cavity\.html"\s+aria-current="page"/);
  assert.match(cavity, /href="\.\/atlas\.html"/);
  assert.match(cavity, /href="\.\/explorer\.html"/);

  assert.match(atlas, /href="\.\/cavity\.html"/);
  assert.match(atlas, /class="lab-tag"\s+aria-current="page"/);
  assert.match(atlas, /href="\.\/explorer\.html"/);

  assert.match(explorer, /href="\.\/cavity\.html"/);
  assert.match(explorer, /href="\.\/atlas\.html"/);
  assert.match(explorer, /href="\.\/explorer\.html"\s+aria-current="page"/);
});

test('resolveExplorerUrl builds embedded and external URLs for all subviews without browser DOM', () => {
  for (const [key, spec] of Object.entries(EXPLORER_VIEWS)) {
    const emb = resolveExplorerUrl(key, { embed: true });
    const ext = resolveExplorerUrl(key, { embed: false });
    assert.ok(emb.startsWith(EXPLORER_BASE));
    assert.ok(ext.startsWith(EXPLORER_BASE));
    assert.match(emb, /\?embed=1/);
    assert.doesNotMatch(ext, /embed=1/);
    assert.ok(emb.includes(spec.path));
    if (spec.hash) {
      assert.ok(emb.endsWith(spec.hash));
      assert.ok(ext.endsWith(spec.hash));
    }
  }
  assert.equal(resolveExplorerUrl('nonexistent'), resolveExplorerUrl('main'));
});
