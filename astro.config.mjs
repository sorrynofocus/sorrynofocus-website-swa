// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Your public URL. Used for the sitemap and social-share tags.
  // Change this once you know your Vercel / Azure URL (or custom domain).
  site: 'https://my-web-7crvlbhuz-cwrun.vercel.app/',
  integrations: [react(), sitemap()],
});
