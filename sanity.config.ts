'use client';

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { defineConfig } from 'sanity';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  schema,
  plugins: [],
});
