module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("css");
  return {
    markdownTemplateEngine: "liquid",
    dir: {
      layouts: "_layouts",
      includes: "_includes"
    }
  };
};

