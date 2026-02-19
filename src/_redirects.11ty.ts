interface RedirectConfig {
  source: string;
  destination: string;
  code: number;
}

/**
 * Redirects configuration for Cloudflare Pages.
 *
 * @see https://developers.cloudflare.com/pages/configuration/redirects/
 */
export default class Redirects {
  redirects: RedirectConfig[];

  constructor() {
    this.redirects = [];
  }

  data() {
    return {
      permalink: '/_redirects',
      eleventyExcludeFromCollections: true,
    };
  }

  async render(_data: unknown) {
    const output: string[] = [];

    this.redirects.forEach((redirectConfig) => {
      output.push(
        `${redirectConfig.source} ${redirectConfig.destination} ${redirectConfig.code}`,
      );
    });

    return output.join('\n');
  }
}
