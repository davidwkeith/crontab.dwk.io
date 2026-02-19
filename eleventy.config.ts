import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import dotenv from 'dotenv';
import sharedPlugin from '@dwk/eleventy-shared';
import type UserConfig from '@11ty/eleventy/src/UserConfig';

import addPlugins from './config/plugins.ts';
import addShortcodes from './config/shortcodes.ts';

/**
 * Load environment variables from .env file.
 */
dotenv.config();

/**
 * Eleventy configuration function.
 */
export default function (eleventyConfig: UserConfig) {
  eleventyConfig.addGlobalData(
    'cspNonce',
    crypto.randomBytes(16).toString('base64'),
  );
  // FIXME: Workaround for a known issue in eleventy-plugin-webc (https://github.com/11ty/eleventy-plugin-webc/issues/86).
  eleventyConfig.setFreezeReservedData(false);

  eleventyConfig.addPlugin(sharedPlugin, {
    url: 'https://crontab.dwk.io',
    language: 'en',
    securityContact: 'mailto:git@dwk.io?subject=Security%20Bug%20Report%3A%20%40dwk%2Fcrontab.dwk.io',
    humans: {
      commitHash: childProcess.execSync('git rev-parse --short HEAD').toString().trim(),
    },
    fourOhFour: { layout: 'base.webc', title: '404 Not Found' },
    enableConfig: { postcss: true },
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy('img/favicon.svg');
  eleventyConfig.addPassthroughCopy('src/main.css');
  eleventyConfig.addPassthroughCopy('src/main.js');

  addPlugins(eleventyConfig);
  addShortcodes(eleventyConfig);

  return {
    templateFormats: ['11ty.js', '11ty.ts', 'webc', 'md', 'html'],
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
    },
    markdownTemplateEngine: 'webc',
    htmlTemplateEngine: 'webc',
  };
}
