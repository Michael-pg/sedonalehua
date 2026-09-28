/**
 * Uploads every prepared image in ../brief/web/img and writes an asset map
 * (filename → Sanity asset id) to ../app/data/demo-assets.json, used by the
 * storefront's demo catalog until Shopify is connected. Safe to re-run.
 *
 *   npx sanity exec scripts/upload-demo-assets.ts --with-user-token
 */
import {createReadStream, readdirSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {getCliClient} from 'sanity/cli';

const client = getCliClient({apiVersion: '2025-01-01'});
const IMG = resolve(process.cwd(), '../brief/web/img');
const OUT = resolve(process.cwd(), '../app/data/demo-assets.json');

async function main() {
  const map: Record<string, string> = {};
  for (const file of readdirSync(IMG)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort()) {
    const asset = await client.assets.upload(
      'image',
      createReadStream(`${IMG}/${file}`),
      {
        filename: file,
      },
    );
    map[file.replace(/\.\w+$/, '')] = asset._id;
    console.log(file, '→', asset._id);
  }
  mkdirSync(resolve(OUT, '..'), {recursive: true});
  writeFileSync(OUT, JSON.stringify(map, null, 2) + '\n');
  console.log('wrote', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
