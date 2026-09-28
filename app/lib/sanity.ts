import {createImageUrlBuilder} from '@sanity/image-url';

/**
 * Sanity holds editorial content (hero video, lookbook imagery, copy).
 * Shopify stays the source of truth for products.
 * The dataset is public-read, so no token is needed on the storefront.
 */
export const SANITY_PROJECT_ID = 'cqoaq6cf';
export const SANITY_DATASET = 'production';

const builder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

export interface SanityImage {
  asset?: {_ref?: string; _id?: string};
  hotspot?: {x: number; y: number};
  crop?: Record<string, number>;
  alt?: string;
  caption?: string;
}

export function urlFor(image: SanityImage) {
  return builder.image(image).auto('format').quality(78);
}

/** Build `src` + `srcSet` for a responsive image at a fixed aspect ratio. */
export function imageProps(
  image: SanityImage,
  {
    aspect,
    widths = [480, 800, 1200, 1600, 2200],
  }: {aspect?: number; widths?: number[]} = {},
) {
  const at = (w: number) => {
    let b = urlFor(image).width(w);
    if (aspect) b = b.height(Math.round(w / aspect)).fit('crop');
    return b.url();
  };
  return {
    src: at(widths[Math.floor(widths.length / 2)]),
    srcSet: widths.map((w) => `${at(w)} ${w}w`).join(', '),
  };
}

/** CSS object-position from the Sanity hotspot, for `object-cover` images. */
export function hotspotPosition(image: SanityImage) {
  const {x = 0.5, y = 0.5} = image.hotspot ?? {};
  return `${x * 100}% ${y * 100}%`;
}

export interface HeroLayer {
  _key: string;
  image: SanityImage;
  opacity?: number;
  blend?: string;
  placement?: 'left' | 'right' | 'full';
}

export interface HomePage {
  heroTitle?: string;
  heroVideoUrl?: string;
  heroVideoMobileUrl?: string;
  heroPoster?: SanityImage;
  heroLayers?: HeroLayer[];
  readyToWearHeading?: string;
  statement?: string;
  statementImages?: (SanityImage & {_key: string})[];
  journalEyebrow?: string;
  journalTitle?: string;
  journalIssue?: string;
  journalImages?: (SanityImage & {_key: string})[];
  aboutHeading?: string;
  aboutBody?: string;
  aboutImage?: SanityImage;
}

export const HOME_PAGE_QUERY = /* groq */ `*[_id == "homePage"][0]{
  heroTitle,
  "heroVideoUrl": heroVideo.asset->url,
  "heroVideoMobileUrl": heroVideoMobile.asset->url,
  heroPoster,
  heroLayers,
  readyToWearHeading,
  statement,
  statementImages,
  journalEyebrow,
  journalTitle,
  journalIssue,
  journalImages,
  aboutHeading,
  aboutBody,
  aboutImage
}`;
