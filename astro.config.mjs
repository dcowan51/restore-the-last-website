import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    // /share-your-project is sent to partners by link only; keep it unlisted.
    sitemap({ filter: (page) => !page.includes('/share-your-project') }),
  ],
  site: 'https://restorethelast.org',
});
