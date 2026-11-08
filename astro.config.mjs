import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    // /share-your-project is sent to partners by link only; keep it unlisted.
    sitemap({
      filter: (page) => !page.includes('/share-your-project'),
      // /story/ is static HTML in public/story/ (built from story-src/), which the
      // sitemap integration can't see. List it by hand, matching each page's canonical tag.
      customPages: ['', 'why', 'moments', 'gift', 'field', 'join'].map(
        (slug) => `https://restorethelast.org/story/${slug}`
      ),
    }),
  ],
  site: 'https://restorethelast.org',
});
