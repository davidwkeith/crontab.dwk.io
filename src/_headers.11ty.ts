interface HeaderConfig {
  source: string;
  headers: Record<string, string>;
}

/**
 * Headers configuration for Cloudflare Pages.
 *
 * @see https://developers.cloudflare.com/pages/configuration/headers/
 */
export default class Headers {
  headers: HeaderConfig[];

  constructor() {
    this.headers = [
      {
        source: '/*',
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer-when-downgrade',
          'Content-Security-Policy': '',
        },
      },
      {
        source: '/feed.json',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ];
  }

  data() {
    return {
      permalink: '/_headers',
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data: { cspNonce: string }) {
    const nonce = data.cspNonce;
    const csp = [
      "default-src 'none'",
      `script-src 'self' 'nonce-${nonce}'`,
      "connect-src 'self'",
      "img-src 'self' https://app.greenweb.org https://s3.nl-ams.scw.cloud",
      `style-src 'self' 'nonce-${nonce}'`,
      "frame-ancestors 'self'",
      "form-action 'self'",
    ].join('; ');

    const output: string[] = [];

    this.headers.forEach((headerConfig) => {
      if (headerConfig.headers['Content-Security-Policy'] !== undefined) {
        headerConfig.headers['Content-Security-Policy'] = csp;
      }
      if (
        headerConfig.headers['Content-Security-Policy-Report-Only'] !==
        undefined
      ) {
        headerConfig.headers['Content-Security-Policy-Report-Only'] = csp;
      }
      output.push(headerConfig.source);
      for (const [key, value] of Object.entries(headerConfig.headers)) {
        output.push(`  ${key}: ${value}`);
      }
    });

    return output.join('\n');
  }
}
