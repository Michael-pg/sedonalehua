import {createClient} from '@sanity/client';
import {SANITY_DATASET, SANITY_PROJECT_ID} from '~/lib/sanity';

/** Server-only Sanity client (kept out of the browser bundle). */
export const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2025-01-01',
  useCdn: true,
});
