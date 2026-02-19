import Image from '@11ty/eleventy-img';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs/promises';
import type UserConfig from '@11ty/eleventy/src/UserConfig';

export default function (eleventyConfig: UserConfig) {
  /**
   * Generates favicon links for various sizes from a source SVG.
   */
  eleventyConfig.addShortcode('favicon', async (src: string) => {
    if (!src) {
      throw new Error("Favicon shortcode requires a 'src' attribute.");
    }

    const metadata = await Image(src, {
      widths: [180, 192, 512],
      formats: ['png'],
      outputDir: './_site/img/favicons/',
      urlPath: '/img/favicons/',
      filenameFormat: (
        id: string,
        _src: string,
        width: number,
        format: string,
      ) => `favicon-${width}.${format}`,
    });

    let linkHtml = '';
    linkHtml += metadata.png
      .map((image) => {
        if (image.width === 180) {
          return `<link rel="apple-touch-icon" sizes="${image.width}x${image.height}" href="${image.url}">`;
        }
        return `<link rel="icon" type="image/png" sizes="${image.width}x${image.height}" href="${image.url}">`;
      })
      .join('');

    // Generate and add the .ico favicon
    const icoSizes = [16, 24, 32, 48, 64, 128, 256];
    const icoOutputPath = './_site/favicon.ico';
    const svgContent = await fs.readFile(src);

    const pngBuffers = await Promise.all(
      icoSizes.map((size) =>
        sharp(svgContent).resize(size, size).png().toBuffer(),
      ),
    );

    const icoBuffer = await pngToIco(pngBuffers);
    await fs.writeFile(icoOutputPath, icoBuffer);

    linkHtml += `<link rel="icon" href="/favicon.ico" sizes="any">`;
    linkHtml += `<link rel="icon" type="image/svg+xml" href="${src}">`;

    return linkHtml;
  });
}
