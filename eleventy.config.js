import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import dotenv from 'dotenv';
import sharedPlugin from '@dwk/eleventy-shared';

import addPlugins from './config/plugins.js';
import addPostcssTransform from './config/transforms.js';
import addShortcodes from './config/shortcodes.js';
import setLibraries from './config/libraries.js';

/**
 * Load environment variables from .env file.
 */
dotenv.config();

/**
 * Eleventy configuration function.
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 * @returns {object}
 */
export default function (eleventyConfig) {
  eleventyConfig.addGlobalData(
    'cspNonce',
    crypto.randomBytes(16).toString('base64')
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
    disableConfig: { typescript: true, shortcodes: true },
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy('img/favicon.svg');
  eleventyConfig.addPassthroughCopy('src/main.css');
  eleventyConfig.addPassthroughCopy('src/main.js');

  addPlugins(eleventyConfig);
  addPostcssTransform(eleventyConfig);
  addShortcodes(eleventyConfig);
  setLibraries(eleventyConfig);

  return {
    templateFormats: ['11ty.js', 'webc', 'md', 'html'],
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
