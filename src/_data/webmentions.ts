import EleventyFetch from '@11ty/eleventy-fetch';
import site from './site.ts';

/**
 * Fetches webmentions from webmention.io for the configured domain.
 */
export default async function (): Promise<unknown[]> {
  if (!site.hasWebmentions) {
    return [];
  }

  const domain = new URL(site.url).hostname;
  const url = `https://webmention.io/api/mentions.json?target=${domain}`;

  try {
    const webmentions = await EleventyFetch(url, { type: 'json' });
    return webmentions;
  } catch (error) {
    console.error('Failed to fetch webmentions', error);
    return [];
  }
}
