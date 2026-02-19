import Image from '@11ty/eleventy-img';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs/promises';

export default function (eleventyConfig) {
  /**
   * Generates an optimized Open Graph image URL using Eleventy Image.
   * @param {string} src - The path to the source image (relative to the input directory).
   * @returns {Promise<string>} The URL of the optimized JPEG image.
   */
  eleventyConfig.addShortcode('ogImage', async (src) => {
    if (!src) {
      return ''; // Or handle error/default more robustly
    }
    let metadata = await Image(`./${src}`, {
      widths: [1200],
      formats: ['jpeg'],
      outputDir: './_site/img/og/',
      urlPath: '/img/og/',
      filenameFormat: function (id, src, width, format) {
        return `${id}-${width}.${format}`;
      },
    });
    return metadata.jpeg[0].url;
  });

  /**
   * Generates a responsive <picture> element with optimized images.
   * @param {string} src - The path to the source image (relative to the input directory).
   * @param {string} alt - The alt text for the image.
   * @param {string} [classes] - Optional CSS classes to apply to the <img> tag.
   * @returns {Promise<string>} The HTML string for the <picture> element.
   */
  eleventyConfig.addShortcode('image', async (src, alt, classes) => {
    if (!src) {
      throw new Error("Image shortcode requires a 'src' attribute.");
    }
    if (!alt) {
      console.warn(`Image "${src}" is missing alt text.`);
    }

    let metadata = await Image(src, {
      widths: [400, 800, 1200, 1600],
      formats: ['webp', 'jpeg'],
      outputDir: './_site/img/',
      urlPath: '/img/',
      defaultAttributes: {
        loading: 'lazy',
        decoding: 'async',
      },
    });

    let imageAttributes = {
      alt,
      sizes: '(min-width: 1024px) 100vw, 50vw', // Example sizes, can be customized
      loading: 'lazy',
      decoding: 'async',
    };

    if (classes) {
      imageAttributes.class = classes;
    }

    return Image.generateHTML(metadata, imageAttributes);
  });

  /**
   * Generates favicon links for various sizes from a source SVG.
   * @param {string} src - The path to the source SVG favicon (e.g., 'img/favicon.svg').
   * @returns {Promise<string>} The HTML string for favicon <link> elements.
   */
  eleventyConfig.addShortcode('favicon', async (src) => {
    if (!src) {
      throw new Error("Favicon shortcode requires a 'src' attribute.");
    }

    let metadata = await Image(src, {
      widths: [180, 192, 512],
      formats: ['png'],
      outputDir: './_site/img/favicons/',
      urlPath: '/img/favicons/',
      filenameFormat: function (id, src, width, format) {
        return `favicon-${width}.${format}`;
      },
    });

    let linkHtml = '';
    // Regular favicons
    linkHtml += metadata.png
      .map((image) => {
        if (image.width === 180) {
          return `<link rel="apple-touch-icon" sizes="${image.width}x${image.height}" href="${image.url}">`;
        } else {
          return `<link rel="icon" type="image/png" sizes="${image.width}x${image.height}" href="${image.url}">`;
        }
      })
      .join('');

    // Generate and add the .ico favicon
    const icoSizes = [16, 24, 32, 48, 64, 128, 256];
    const icoOutputPath = './_site/favicon.ico';
    const svgContent = await fs.readFile(src);

    const pngBuffers = await Promise.all(
      icoSizes.map((size) =>
        sharp(svgContent).resize(size, size).png().toBuffer()
      )
    );

    const icoBuffer = await pngToIco(pngBuffers);
    await fs.writeFile(icoOutputPath, icoBuffer);

    linkHtml += `<link rel="icon" href="/favicon.ico" sizes="any">`;

    // Add a generic SVG favicon for modern browsers
    linkHtml += `<link rel="icon" type="image/svg+xml" href="${src}">`;

    return linkHtml;
  });
}
