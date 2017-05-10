require('dotenv').config();
const pkg = require('./package.json');
const path = require('path');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const wpParts = require('./libs/wp-parts');
const varMapping = require('./libs/translatedVars');

const PATHS = {
  app: path.join(__dirname, 'src/app'),
  style: [
    path.join(__dirname, 'src/www/css', 'main.css'),
    // TODO - change this to your preferred vendor CSS package and remove this before use - this is a test/placeholder
    // TODO - after removing the above TODO, remove this one also. And then...go nuts! But have fun while you're at it.
    path.join(__dirname, 'node_modules', 'purecss')
  ],
  images: path.join(__dirname, 'src/www/images'),
  fonts: path.join(__dirname, 'src/www/fonts'),
  dist: path.join(__dirname, 'dist')
};

const common = merge(
  {
    entry: {
      app: PATHS.app,
      style: PATHS.style
    },
    output: {
      path: PATHS.dist,
      filename: '[name].[hash].js'
    },
  },
  wpParts.fonts(PATHS.fonts),
  wpParts.images(PATHS.images),
  wpParts.svg(PATHS.images),
  // wpParts.linting(PATHS.app),
  wpParts.indexTemplate({ title: 'Replace me!', appMountId: 'app' }),
  wpParts.translateVariables(varMapping.translationVariables)
);

const build = merge(
  common,
  wpParts.minify(),
  wpParts.optimizeVariables(
    'process.env.NODE_ENV',
    'production'
  ),
  wpParts.extractBundle({
    name: 'vendor',
    entries: Object.keys(pkg.dependencies)
  }),
  wpParts.removeDuplicateVendorDeps(),
  wpParts.purify(PATHS.style),
  wpParts.extractStyling(PATHS.style),
  wpParts.compressImages(PATHS.images),
  wpParts.clean(PATHS.dist), {
    devtool: 'source-map',
    output: {
      path: PATHS.dist,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    }
  });

var config;
const validateArgs = {};

switch (process.env.npm_lifecycle_event) {
  case 'build':
    // the build, {} below is intentional - add any additional parameters to the {}
    config = merge(build, {});
    break;
  case 'stats':
    // same as the webpack build config, except run it in --profile mode
    config = merge(build,
      wpParts.stats('stats.json', {
        chunkModules: true,
        exclude: [/node_modules[\\\/]react/]
      }), {
        profile: true
      });
    validateArgs.quiet = true;
    break;
  default:
    config = merge(common,
      wpParts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      }),
      wpParts.styling(PATHS.style), {
        devtool: 'eval-source-map'
      });
}

module.exports = validate(config, validateArgs);
