import eleventyWebcPlugin from '@11ty/eleventy-plugin-webc';
import { eleventyImagePlugin } from '@11ty/eleventy-img';
import type UserConfig from '@11ty/eleventy/src/UserConfig';

export default function (eleventyConfig: UserConfig) {
  eleventyConfig.addPlugin(eleventyWebcPlugin, {
    components: [
      'src/_includes/**/*.webc',
      'npm:@11ty/eleventy-img/*.webc',
      'npm:@dwk/web-components/components/*.webc',
    ],
  });

  eleventyConfig.addPlugin(eleventyImagePlugin, {
    formats: ['webp', 'jpeg', 'png'],
    outputDir: './_site/img/',
    urlPath: '/img/',
    defaultAttributes: {
      loading: 'lazy',
      decoding: 'async',
    },
  });
}
