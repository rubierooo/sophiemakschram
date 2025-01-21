console.log("Eleventy config file is running");

const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Copy CSS to root
  eleventyConfig.addPassthroughCopy("./src/bundle.css");
  eleventyConfig.addPassthroughCopy("./src/bg.jpg");
  eleventyConfig.addPassthroughCopy("./src/jquery.ripples.js");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addCollection("projectsByYear", function(collectionApi) {
    const projects = collectionApi.getFilteredByGlob("./src/projects/*.md");

    // Group projects by the "year" field
    const projectsByYear = projects.reduce((acc, project) => {
      const year = project.data.year;  // Use the "year" field from the front matter
      acc[year] = acc[year] || [];
      acc[year].push(project);
      return acc;
    }, {});
    console.log("Projects by Year:", projectsByYear);  // Log the collection
    // Sort by year in descending order
    return Object.entries(projectsByYear).sort((a, b) => b[0] - a[0]);
  });

  eleventyConfig.addCollection("performancesByYear", function(collectionApi) {
    const performances = collectionApi.getFilteredByGlob("./src/performances/*.md");

    // Group projects by the "year" field
    const performancesByYear = performances.reduce((acc, performance) => {
      const year = performance.data.year;  // Use the "year" field from the front matter
      acc[year] = acc[year] || [];
      acc[year].push(performance);
      return acc;
    }, {});
    // Sort by year in descending order
    return Object.entries(performancesByYear).sort((a, b) => b[0] - a[0]);
  });

  eleventyConfig.addCollection("writingByYear", function(collectionApi) {
    const writings = collectionApi.getFilteredByGlob("./src/writing/*.md");

    // Group projects by the "year" field
    const writingByYear = writings.reduce((acc, writing) => {
      const year = writings.data.year;  // Use the "year" field from the front matter
      acc[year] = acc[year] || [];
      acc[year].push(project);
      return acc;
    }, {});
    // Sort by year in descending order
    return Object.entries(writingByYear).sort((a, b) => b[0] - a[0]);
  });

  eleventyConfig.addCollection("workshopsByYear", function(collectionApi) {
    const workshops = collectionApi.getFilteredByGlob("./src/workshops/*.md");

    // Group projects by the "year" field
    const workshopsByYear = workshops.reduce((acc, workshop) => {
      const year = workshop.data.year;  // Use the "year" field from the front matter
      acc[year] = acc[year] || [];
      acc[year].push(workshop);
      return acc;
    }, {});
    // Sort by year in descending order
    return Object.entries(workshopsByYear).sort((a, b) => b[0] - a[0]);
  });
  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
}
