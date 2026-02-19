import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  author: {
    '@type': 'Person',
    name: pkg.author.name as string,
    url: pkg.author.url as string,
  },
} as const;

export default schema;
