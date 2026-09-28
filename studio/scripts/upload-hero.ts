/**
 * Re-upload just the hero video + poster (after running scripts/encode-hero.sh)
 * and point the home page at them. Leaves every other field untouched.
 *
 *   npx sanity exec scripts/upload-hero.ts --with-user-token
 */
import {createReadStream} from 'node:fs';
import {resolve} from 'node:path';
import {getCliClient} from 'sanity/cli';

const client = getCliClient({apiVersion: '2025-01-01'});
const WEB = resolve(process.cwd(), '../brief/web');

const upload = (type: 'file' | 'image', name: string, contentType?: string) =>
  client.assets.upload(type, createReadStream(`${WEB}/${name}`), {
    filename: name,
    ...(contentType ? {contentType} : {}),
  });

const ref = (_ref: string) => ({_type: 'reference', _ref});

const [desktop, mobile, poster] = await Promise.all([
  upload('file', 'hero-desktop.mp4', 'video/mp4'),
  upload('file', 'hero-mobile.mp4', 'video/mp4'),
  upload('image', 'hero-desktop-poster.jpg'),
]);

await client
  .patch('homePage')
  .set({
    heroVideo: {_type: 'file', asset: ref(desktop._id)},
    heroVideoMobile: {_type: 'file', asset: ref(mobile._id)},
    'heroPoster.asset': ref(poster._id),
  })
  .commit();

console.log('hero updated', desktop._id, mobile._id, poster._id);
