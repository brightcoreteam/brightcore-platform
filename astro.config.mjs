import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

/**
 * Deployment configuration
 * ------------------------------------------------------------------
 * BASE_PATH : the sub-path the site is served from.
 *             - GitHub *project* page  -> "/<repo-name>/"  (set automatically by the CI workflow)
 *             - GitHub *user* page or custom domain -> "/"
 * SITE_URL  : absolute origin used for canonical URLs, sitemap and OG tags.
 */
const defaultSiteUrl = 'https://brightcoreteam.github.io/brightcore-platform/';
const rawSiteUrl = (process.env.SITE_URL || defaultSiteUrl).replace(/\/+$/, '');
const parsedUrl = new URL(rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`);

const rawBase = process.env.BASE_PATH || (parsedUrl.pathname !== '/' ? parsedUrl.pathname : '/');
const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;
const site = parsedUrl.origin;

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'ar',
        locales: { ar: 'ar', en: 'en' },
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    build: {
      chunkSizeWarningLimit: 1500,
    },
  },
});
