import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {HOME_PAGE_QUERY, type HomePage} from '~/lib/sanity';
import {sanity} from '~/lib/sanity.server';
import {DEMO_PRODUCTS} from '~/lib/demo-catalog';
import {Hero} from '~/components/home/Hero';
import {ReadyToWear} from '~/components/home/ReadyToWear';
import {Gallery} from '~/components/home/Gallery';
import {AboutSplit} from '~/components/home/AboutSplit';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Sedona Lehua'},
    {
      name: 'description',
      content: 'Dresses made slowly, in linen, lace and cotton.',
    },
  ];
};

export async function loader() {
  const home = await sanity.fetch<HomePage | null>(HOME_PAGE_QUERY);
  if (!home)
    throw new Response('Home page content missing in Sanity', {status: 500});

  // Demo catalog stands in for a Shopify "Ready-to-Wear" collection query.
  const featured = [
    'lace-poncho-top',
    'tiered-cotton-sundress',
    'striped-ruffle-gown',
    'striped-tie-shoulder-dress',
    'sculpted-bridal-gown',
  ]
    .map((handle) => DEMO_PRODUCTS.find((p) => p.handle === handle)!)
    .filter(Boolean);

  return {home, featured};
}

export default function Homepage() {
  const {home, featured} = useLoaderData<typeof loader>();
  return (
    <>
      <Hero data={home} />
      <ReadyToWear
        heading={home.readyToWearHeading ?? 'Ready-to-Wear'}
        products={featured}
      />
      {/* Statement + Journal sections hidden per client review (2026-09-29);
          components kept in components/home/ in case they come back. */}
      <Gallery
        images={(home.journalImages ?? []).filter(
          // Skip shots already used as a product's lead image in the row above.
          (img) =>
            !featured.some((p) => p.images[0].asset?._ref === img.asset?._ref),
        )}
      />
      <AboutSplit
        heading={home.aboutHeading}
        body={home.aboutBody}
        image={home.aboutImage}
      />
    </>
  );
}
