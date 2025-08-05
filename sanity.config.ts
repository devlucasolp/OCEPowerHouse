'use client';

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  // Set to false if statically generating pages, using ISR or tag-based revalidation
  useCdn: false,
  schema,
  plugins: [
    deskTool({ structure }),
    // Vision lets you query your content with GROQ in the studio
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  tools: (prev) => {
    // 👇 Usar somente no modo desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      return prev;
    }
    // 👇 Remover vision tool na produção por segurança
    return prev.filter((tool) => tool.name !== 'vision');
  },
});
