/**
 * Demo catalog — stands in for Shopify until the store is connected.
 *
 * Shapes loosely mirror the Storefront API (handle, title, price, images,
 * options/variants) so routes can swap to real queries without UI changes.
 * Names, prices and copy are PLACEHOLDERS for review, not final product data.
 * Images are Sanity assets (see app/data/demo-assets.json).
 */
import assets from '~/data/demo-assets.json';
import type {SanityImage} from '~/lib/sanity';

export interface DemoProduct {
  handle: string;
  title: string;
  category: 'Dresses' | 'Tops' | 'Bridal';
  price: number;
  compareAtPrice?: number;
  currency: 'USD';
  tagline: string;
  description: string;
  details: {label: string; value: string}[];
  sizes: string[];
  soldOut?: string[];
  madeToOrder?: boolean;
  images: SanityImage[];
}

const img = (key: keyof typeof assets, alt: string): SanityImage => ({
  asset: {_ref: assets[key]},
  alt,
});

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    handle: 'tiered-cotton-sundress',
    category: 'Dresses',
    title: 'Tiered Cotton Sundress',
    price: 365,
    currency: 'USD',
    tagline: 'Ivory cotton voile, pintucked bodice',
    description:
      'A fine cotton voile sundress with a pintucked bodice and three gathered tiers that move like surf. Thin adjustable straps, fully lined to the hip.',
    details: [
      {label: 'Fabric', value: '100% cotton voile'},
      {label: 'Fit', value: 'Relaxed through the skirt'},
      {label: 'Length', value: 'Midi'},
      {label: 'Care', value: 'Cold hand wash, line dry'},
    ],
    sizes: SIZES,
    soldOut: ['XS'],
    images: [
      img('R0002434', 'Tiered ivory cotton sundress, three-quarter view'),
      img('R0002437', 'Tiered ivory cotton sundress, front'),
      img('R0002453', 'Seated in the ivory sundress with a crochet cap'),
    ],
  },
  {
    handle: 'striped-ruffle-gown',
    category: 'Dresses',
    title: 'Striped Ruffle Gown',
    price: 420,
    currency: 'USD',
    tagline: 'Sage ticking stripe, cascading ruffle',
    description:
      'A floor-length gown in sage ticking stripe with a deep V and a single cascading ruffle cut on the bias. Ties at the back.',
    details: [
      {label: 'Fabric', value: 'Cotton-linen blend'},
      {label: 'Fit', value: 'Fitted bodice, fluid skirt'},
      {label: 'Length', value: 'Floor'},
      {label: 'Care', value: 'Dry clean'},
    ],
    sizes: SIZES,
    images: [
      img('R0002508', 'Striped ruffle gown, full length'),
      img('R0002520', 'Striped ruffle gown with crochet cap'),
      img('R0002516', 'Striped ruffle gown, protea held over the face'),
    ],
  },
  {
    handle: 'striped-tie-shoulder-dress',
    category: 'Dresses',
    title: 'Striped Tie-Shoulder Dress',
    price: 385,
    currency: 'USD',
    tagline: 'Chocolate awning stripe, dropped waist',
    description:
      'An awning-stripe maxi with tie shoulders and a dropped, gathered hem. Easy to throw on, hard to take off.',
    details: [
      {label: 'Fabric', value: '100% cotton poplin'},
      {label: 'Fit', value: 'Loose, dropped waist'},
      {label: 'Length', value: 'Maxi'},
      {label: 'Care', value: 'Cold wash, line dry'},
    ],
    sizes: SIZES,
    soldOut: ['L'],
    images: [
      img('R0002605', 'Striped tie-shoulder dress in profile'),
      img('R0002633', 'Striped tie-shoulder dress, turning away'),
      img('R0002618', 'Smiling in the striped tie-shoulder dress'),
      img('R0002642', 'Striped tie-shoulder dress in the studio'),
    ],
  },
  {
    handle: 'lace-poncho-top',
    category: 'Tops',
    title: 'Lace Poncho Top',
    price: 248,
    currency: 'USD',
    tagline: 'Midnight cotton lace, open sleeve',
    description:
      'A square-cut poncho in midnight cotton lace that drapes off one shoulder. Layer over a slip or wear alone with wide trousers.',
    details: [
      {label: 'Fabric', value: 'Cotton lace'},
      {label: 'Fit', value: 'One size, oversized'},
      {label: 'Care', value: 'Hand wash cold, dry flat'},
    ],
    sizes: ['One size'],
    images: [
      img('R0002559', 'Lace poncho top with pale trousers'),
      img('R0002588', 'Lace poncho top, full length'),
      img('R0002564', 'Seated in the lace poncho top'),
      img('R0002576', 'Lace poncho top, seated side view'),
    ],
  },
  {
    handle: 'sculpted-bridal-gown',
    category: 'Bridal',
    title: 'Sculpted Bridal Gown',
    price: 2400,
    currency: 'USD',
    tagline: 'Made to order · ivory silk faille',
    description:
      'A strapless gown with a hand-sculpted floral bodice and a tiered, ruffled skirt, finished with a floral cathedral veil. Made to order in 10–12 weeks.',
    details: [
      {label: 'Fabric', value: 'Silk faille, silk organza'},
      {label: 'Lead time', value: '10–12 weeks'},
      {label: 'Fittings', value: 'Two included'},
    ],
    sizes: ['Made to measure'],
    madeToOrder: true,
    images: [img('R0002372', 'Sculpted ivory bridal gown with floral veil')],
  },
];

export const DEMO_CATEGORIES = ['Dresses', 'Tops', 'Bridal'] as const;

export function getDemoProduct(handle: string) {
  return DEMO_PRODUCTS.find((p) => p.handle === handle) ?? null;
}

export function formatPrice(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 ? 2 : 0,
  }).format(amount);
}
