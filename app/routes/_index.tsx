import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {HOME_PAGE_QUERY, type HomePage} from '~/lib/sanity';
import {sanity} from '~/lib/sanity.server';
import {DEMO_PRODUCTS} from '~/lib/demo-catalog';
import {Hero} from '~/components/home/Hero';
import {ReadyToWear} from '~/components/home/ReadyToWear';
import {Statement} from '~/components/home/Statement';
import {Journal} from '~/components/home/Journal';
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
      {home.statement && (
        <Statement text={home.statement} images={home.statementImages} />
      )}
      {home.journalImages?.length ? (
        <Journal
          eyebrow={home.journalEyebrow}
          title={home.journalTitle}
          issue={home.journalIssue}
          images={home.journalImages}
        />
      ) : null}
      <AboutSplit
        heading={home.aboutHeading}
        body={home.aboutBody}
        image={home.aboutImage}
      />
    </>
  );
}
