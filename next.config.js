const withTypescript = require("@zeit/next-typescript");
const withCSS = require("@zeit/next-css");
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  distDir: "./.next"
};

module.exports = withPlugins([
  [
    withCSS,
    {
      cssModules: true,
      webpack: config => {
        return config;
      }
    }
  ],
  withTypescript,
  nextConfig
]);
