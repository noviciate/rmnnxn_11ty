const Image = require("@11ty/eleventy-img");
const path = require("path");

// Shared image processing function
async function processImage(src, alt, widths, loading) {
  const filePath = src.startsWith("/") ? src.slice(1) : src;
  loading = loading || "lazy";

  let metadata;
  try {
    metadata = await Image(filePath, {
      widths: widths,
      formats: ["webp", "jpeg"],
      outputDir: "./_site/img/",
      urlPath: "/img/",
      filenameFormat: function(id, src, width, format) {
        const ext = path.extname(src);
        const name = path.basename(src, ext);
        return `${name}-${width}w.${format}`;
      }
    });
  } catch(e) {
    return `<img src="${src}" alt="${alt}" loading="${loading}">`;
  }

  const webp = metadata.webp[0];
  const jpeg = metadata.jpeg[0];

  return `<picture>
    <source type="image/webp" srcset="${webp.url}">
    <img src="${jpeg.url}" alt="${alt}" loading="${loading}" width="${jpeg.width}" height="${jpeg.height}">
  </picture>`;
}

// Parse liquid tag arguments helper
function parseLiquidArgs(liquidEngine, args) {
  return args.trim().match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)
    .map(a => a.replace(/^['"]|['"]$/g, ""));
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("_redirects");

  // Gallery thumbnail — 400px for grid display
  eleventyConfig.addLiquidTag("galleryImage", function(liquidEngine) {
    return {
      parse: function(tagToken) {
        this.args = tagToken.args;
      },
      render: async function(scope) {
        const parts = parseLiquidArgs(liquidEngine, this.args);
        const src = scope.get(parts[0]) || parts[0];
        const alt = parts[1] ? (scope.get(parts[1]) || parts[1]) : "";
        return await processImage(src, alt, [400], "lazy");
      }
    };
  });

  // Hero image — 720px for homepage sections
  eleventyConfig.addLiquidTag("heroImage", function(liquidEngine) {
    return {
      parse: function(tagToken) {
        this.args = tagToken.args;
      },
      render: async function(scope) {
        const parts = parseLiquidArgs(liquidEngine, this.args);
        const src = parts[0];
        const alt = parts.slice(1).join(" ");
        return await processImage(src, alt, [720], "lazy");
      }
    };
  });

  // Portrait image — 340px, eager loading since above fold
  eleventyConfig.addLiquidTag("portraitImage", function(liquidEngine) {
    return {
      parse: function(tagToken) {
        this.args = tagToken.args;
      },
      render: async function(scope) {
        const parts = parseLiquidArgs(liquidEngine, this.args);
        const src = parts[0];
        const alt = parts.slice(1).join(" ");
        return await processImage(src, alt, [340], "eager");
      }
    };
  });

  // Writing collection
  eleventyConfig.addCollection("writing", function(collectionApi) {
    return collectionApi.getFilteredByGlob("writing/*.md");
  });

  // Photos interleaved
  eleventyConfig.addFilter("interleave", function(photos) {
    const groups = {};
    photos.forEach(photo => {
      if (!groups[photo.category]) groups[photo.category] = [];
      groups[photo.category].push(photo);
    });
    const result = [];
    const maxLength = Math.max(...Object.values(groups).map(g => g.length));
    for (let i = 0; i < maxLength; i++) {
      Object.values(groups).forEach(group => {
        if (group[i]) result.push(group[i]);
      });
    }
    return result;
  });

  return {
    markdownTemplateEngine: "liquid",
    dataTemplateEngine: "liquid",
    templateFormats: ["html", "md", "liquid", "njk"],
    dir: {
      layouts: "_layouts",
      includes: "_includes"
    }
  };
};
