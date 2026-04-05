module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addCollection("writing", function(collectionApi) {
    return collectionApi.getFilteredByGlob("writing/*.md");
  });
  return {
    markdownTemplateEngine: "liquid",
    dataTemplateEngine: "liquid",
    templateFormats: ["html", "md", "markdown", "liquid", "njk"],
    dir: {
      layouts: "_layouts",
      includes: "_includes"
    }
  };
};
