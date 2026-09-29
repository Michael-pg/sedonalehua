import type {Route} from './+types/collections.all';
import {isDemoStore} from '~/lib/store-mode';
import {useLoaderData} from 'react-router';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {DEMO_PRODUCTS} from '~/lib/demo-catalog';
import {ShopGrid} from '~/components/shop/ShopGrid';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Shop — Sedona Lehua'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Demo catalog until a Shopify store is linked.
  if (isDemoStore(args.context.env)) {
    return {demo: true as const, demoProducts: DEMO_PRODUCTS};
  }

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {demo: false as const, ...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-[1600px] px-5 pt-10 pb-24 md:px-10 md:pt-16 md:pb-36">
      <header className="mb-10 grid gap-6 md:mb-14 md:grid-cols-12 md:items-end">
        <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] md:col-span-7">
          Shop
        </h1>
        <p className="max-w-sm text-[15px] leading-relaxed text-ink/75 md:col-span-5 md:justify-self-end">
          Ready-to-wear and made-to-order pieces, cut in small runs from linen,
          lace and cotton.
        </p>
      </header>
      {data.demo ? (
        <ShopGrid products={data.demoProducts} />
      ) : (
        <ShopifyCatalog products={data.products} />
      )}
    </div>
  );
}

type ShopifyData = Extract<Awaited<ReturnType<typeof loader>>, {demo: false}>;

/** Live Shopify catalog — restyle to match ShopGrid when the store is linked. */
function ShopifyCatalog({products}: Pick<ShopifyData, 'products'>) {
  return (
    <div className="collection">
      <PaginatedResourceSection<CollectionItemFragment>
        connection={products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
