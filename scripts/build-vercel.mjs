/**
 * Turn the Hydrogen build (dist/) into Vercel's Build Output API layout
 * (.vercel/output): static client assets + one Edge Function for SSR.
 * Run after `npm run build` — or use `npm run build:vercel`.
 */
import {cp, mkdir, rm, writeFile} from 'node:fs/promises';
import {build} from 'esbuild';

const OUT = '.vercel/output';
const FUNC = `${OUT}/functions/index.func`;

await rm(OUT, {recursive: true, force: true});
await mkdir(FUNC, {recursive: true});

await cp('dist/client', `${OUT}/static`, {recursive: true});

await build({
  entryPoints: ['vercel/edge-entry.js'],
  outfile: `${FUNC}/index.js`,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  legalComments: 'none',
  conditions: ['worker', 'browser'],
  logLevel: 'warning',
});

await writeFile(
  `${FUNC}/.vc-config.json`,
  JSON.stringify({runtime: 'edge', entrypoint: 'index.js'}, null, 2),
);

await writeFile(
  `${OUT}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        {
          src: '^/assets/(.*)$',
          headers: {'cache-control': 'public, max-age=31536000, immutable'},
          continue: true,
        },
        {handle: 'filesystem'},
        {src: '/(.*)', dest: '/index'},
      ],
    },
    null,
    2,
  ),
);

console.log(`Vercel output written to ${OUT}`);
