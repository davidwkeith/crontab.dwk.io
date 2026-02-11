/**
 * Represents the Headers configuration for Cloudflare Pages.
 *
 * @see https://developers.cloudflare.com/pages/configuration/headers/
 */
export default class Headers {
  constructor() {
    /**
     * Defines the headers to be output to the `_headers` file.
     * Each object in the array can represent either a redirect or a set of HTTP response headers.
     *
     * For HTTP response headers:
     * @property {string} source - The URL path to apply the headers to (e.g., "/*").
     * @property {object} headers - An object where keys are header names and values are header values.
     *
     * @type {Array<Object>}
     */
    this.headers = [
      // Global security headers example
      {
        source: '/*',
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer-when-downgrade',
          // CSP is completed at render time to include the build-time nonce.
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

  /**
   * Eleventy data method to define permalink and exclude from collections.
   * @returns {object}
   */
  data() {
    return {
      permalink: '/_headers',
      eleventyExcludeFromCollections: true,
    };
  }

  /**
   * Renders the headers configuration into a string format for the `_headers` file.
   * @param {object} data - Eleventy's data cascade.
   * @returns {Promise<string>} The formatted headers string.
   */
  async render(data) {
    const nonce = data.cspNonce;
    const csp = [
      "default-src 'none'",
      `script-src 'self' 'nonce-${nonce}'`,
      "connect-src 'self'",
      "img-src 'self' https://app.greenweb.org",
      `style-src 'self' 'nonce-${nonce}'`,
      "frame-ancestors 'self'",
      "form-action 'self'",
    ].join('; ');

    let output = [];

    this.headers.forEach((headerConfig) => {
      if (headerConfig.headers) {
        if (headerConfig.headers['Content-Security-Policy'] !== undefined) {
          headerConfig.headers['Content-Security-Policy'] = csp;
        }
        if (
          headerConfig.headers['Content-Security-Policy-Report-Only'] !==
          undefined
        ) {
          headerConfig.headers['Content-Security-Policy-Report-Only'] = csp;
        }
        // This is a set of HTTP response headers
        output.push(headerConfig.source);
        for (const [key, value] of Object.entries(headerConfig.headers)) {
          output.push(`  ${key}: ${value}`);
        }
      }
    });

    return output.join('\n');
  }
}
