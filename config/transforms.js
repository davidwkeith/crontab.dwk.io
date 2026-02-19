import postcss from 'postcss';
import postcssLoadConfig from 'postcss-load-config';

export default function (eleventyConfig) {
  eleventyConfig.addTransform('postcss', async function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith('.css')) {
      const { plugins, options } = await postcssLoadConfig();
      return await postcss(plugins).process(content, options);
    }
    return content;
  });
}
