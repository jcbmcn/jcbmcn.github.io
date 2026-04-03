// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jcbmcn.com',

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      // Dual themes: Shiki emits CSS vars instead of inline colors.
      // We control the active theme via [data-theme] on <html>.
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: false,
    },
  },

  integrations: [sitemap()],
});