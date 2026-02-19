import childProcess from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

/**
 * Site-level variables. Often used as fallback for page-level data.
 * Some values are sourced from `package.json`.
 */
export default {
  title: 'crontab clock',

  fediverseCreator: '@dwk@xn--4t8h.dwk.io',

  favicon: {
    src: 'img/favicon.svg',
    appleIconBgColor: '#FFFFFF',
    appleIconPadding: 20,
  },

  hasNavigation: false,
  hasWebmentions: false,
  hasActivityPub: false,
  hasPWA: true,

  pwa: {
    short_name: 'Starter',
    background_color: '#ffffff',
    theme_color: '#000000',
    display: 'standalone' as const,
  },

  hasOpenGraph: true,

  colorScheme: {
    content: 'dark light',
    media: '(prefers-color-scheme: dark)',
  },

  hasTwitter: false,

  rating: 'general',
  language: 'en',

  description: pkg.description as string,
  url: new URL(pkg.homepage as string),
  keywords: pkg.keywords as string[],
  author: pkg.author.name as string,

  headLinks: [
    {
      rel: 'code-repository',
      href: (pkg.repository.url as string).replace('git+', ''),
    },
    {
      rel: 'issues',
      href: pkg.bugs.url as string,
    },
    {
      rel: 'code-license',
      href: pkg.licenseUrl as string,
    },
  ],

  get themeColor(): string {
    return this.favicon.appleIconBgColor;
  },

  get defaultOgImage(): string {
    return this.favicon.src;
  },

  get manifest() {
    return {
      appName: this.title,
      appDescription: this.description,
      lang: this.language,
    };
  },

  get hash(): string {
    return childProcess
      .execSync('git rev-parse --short HEAD')
      .toString()
      .trim();
  },

  funding: pkg.funding as string,
};
