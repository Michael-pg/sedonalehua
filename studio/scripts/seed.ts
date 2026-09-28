/**
 * One-off seed: uploads the prepared media in ../brief/web and writes the
 * homePage document. Safe to re-run — Sanity de-duplicates identical assets.
 *
 *   npm run seed
 */
import {createReadStream} from 'node:fs';
import {basename, resolve} from 'node:path';
import {getCliClient} from 'sanity/cli';

const client = getCliClient({apiVersion: '2025-01-01'});
const WEB = resolve(process.cwd(), '../brief/web');

async function uploadImage(file: string, alt: string, caption?: string) {
  const asset = await client.assets.upload(
    'image',
    createReadStream(`${WEB}/img/${file}`),
    {
      filename: basename(file),
    },
  );
  console.log('image', file, '→', asset._id);
  return {
    _type: 'editorialImage',
    asset: {_type: 'reference', _ref: asset._id},
    alt,
    ...(caption ? {caption} : {}),
  };
}

async function uploadFile(file: string) {
  const asset = await client.assets.upload(
    'file',
    createReadStream(`${WEB}/${file}`),
    {
      filename: basename(file),
      contentType: 'video/mp4',
    },
  );
  console.log('file', file, '→', asset._id);
  return {_type: 'file', asset: {_type: 'reference', _ref: asset._id}};
}

const withKey = <T extends object>(items: T[]) =>
  items.map((item, i) => ({_key: `k${i}`, ...item}));

async function main() {
  const [heroVideo, heroVideoMobile] = await Promise.all([
    uploadFile('hero-desktop.mp4'),
    uploadFile('hero-mobile.mp4'),
  ]);

  const heroPosterAsset = await client.assets.upload(
    'image',
    createReadStream(`${WEB}/hero-desktop-poster.jpg`),
    {filename: 'hero-desktop-poster.jpg'},
  );

  const doc = {
    _id: 'homePage',
    _type: 'homePage',
    heroTitle: 'Sedona Lehua',
    heroVideo,
    heroVideoMobile,
    heroPoster: {
      _type: 'editorialImage',
      asset: {_type: 'reference', _ref: heroPosterAsset._id},
      alt: 'Sunlight moving through shallow water over stones',
    },
    heroLayers: withKey([
      {
        _type: 'heroLayer',
        image: await uploadImage('hibiscus.png', 'Pink hibiscus flower'),
        opacity: 0.78,
        blend: 'normal',
        placement: 'left',
      },
      {
        _type: 'heroLayer',
        image: await uploadImage('cliffs-film.jpg', 'Sea cliffs on 35mm film'),
        opacity: 0.55,
        blend: 'screen',
        placement: 'right',
      },
    ]),

    readyToWearHeading: 'Ready-to-Wear',
    statement:
      'Dresses made slowly, in *linen, lace and cotton*, for long days that end *by the water*.',
    statementImages: withKey([
      await uploadImage('R0002516.jpg', 'Protea flowers held over the face'),
      await uploadImage(
        'R0002618.jpg',
        'Smiling in a brown striped tie-shoulder dress',
      ),
    ]),

    journalEyebrow: 'Journal —',
    journalTitle: 'Notes from the studio',
    journalIssue: '001',
    journalImages: withKey([
      await uploadImage(
        'R0002372.jpg',
        'Sculpted ivory gown with floral veil',
        'The veil',
      ),
      await uploadImage(
        'R0002453.jpg',
        'Seated in an ivory dress with a crochet cap',
        'Ivory, seated',
      ),
      await uploadImage(
        'R0002605.jpg',
        'Profile in a brown striped maxi dress',
        'Stripe, profile',
      ),
      await uploadImage(
        'R0002520.jpg',
        'Portrait in a crochet cap holding protea',
        'Crochet cap',
      ),
      await uploadImage(
        'R0002564.jpg',
        'Seated in lace poncho on a wooden chair',
        'Lace, seated',
      ),
      await uploadImage(
        'R0002633.jpg',
        'Looking back in the striped maxi dress',
        'Stripe, turning',
      ),
    ]),

    aboutHeading: 'About the studio',
    aboutBody:
      'Placeholder — every Sedona Lehua piece is cut and sewn in a small studio, in limited runs. Replace this with the brand story.',
    aboutImage: await uploadImage(
      'R0002644.jpg',
      'Studio desk with sewing machine, dress form and a beach print',
    ),
  };

  await client.createOrReplace(doc);
  console.log('homePage written');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
