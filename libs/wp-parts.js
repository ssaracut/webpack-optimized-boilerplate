const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NpmInstallWebpackPlugin = require('npm-install-webpack-plugin');
const PurifyCssPlugin = require('purifycss-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.devServer = function (options) {
  return {
    devServer: {
      historyApiFallback: true,
      // hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host,
      port: options.port
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      }),
      new NpmInstallWebpackPlugin()
    ]
  };
};

exports.styling = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: paths
        }
      ]
    }
  };
};

exports.extractStyling = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
};

exports.purify = function (paths) {
  return {
    plugins: [
      new PurifyCssPlugin({
        basePath: process.cwd(),
        paths: paths
      })
    ]
  };
};

exports.less = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.less$/,
          loaders: ['style', 'css', 'less'],
          include: paths
        }
      ]
    }
  }
};

exports.sass = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass'],
          include: paths
        }
      ]
    }
  }
};

exports.minify = function () {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  };
};

exports.optimizeVariables = function (key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
};

exports.extractBundle = function (options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    entry: entry,
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: [options.name, 'manifest']
      })
    ]
  }
};

exports.clean = function (paths) {
  return {
    plugins: [
      new CleanWebpackPlugin(paths, {
        root: process.cwd()
      })
    ]
  }
};

/**
 * @param filePath the path/file to dump the stats to, i.e. stats.json
 * @param options an options structure that maps to the stats-webpack-plugin parameters.
 */
exports.stats = function (filePath, options) {
  return {
    plugins: [
      new StatsPlugin(filePath, options)
    ]
  }
};

exports.indexTemplate = function(options) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        title: options.title,
        template: require('html-webpack-template'),
        appMountId: options.appMountId,
        inject: false
      })
    ]
  };
};

exports.linting = function (path) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          include: path
        }
      ]
    }
  }
};

exports.removeDuplicateVendorDeps = function () {
  return {
    plugins: [
      new webpack.optimize.DedupePlugin()
    ]
  };
};

exports.images = function (path) {
  return {
    module: {
      loaders: [
        {
          test: /\.(jpe?g|png|gif)$/,
          loader: 'url',
          include: path,
          query: {
            limit: 2500
          }
        }
      ]
    }
  };
};

exports.svg = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.svg$/,
          loader: 'file',
          include: paths
        }
      ]
    }
  };
};

// unfortunately, this one uses the file-loader and so it is a raw url configuration string and can't use the query block
// BUT...
//    IN GENERAL THIS SHOULD BE AVOIDED AT ALL COSTS!!!
exports.compressImages = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          loaders: [
            'file?hash=sha512&digest=hex&name=images.[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
          ],
          include: paths
        }
      ]
    }
  };
};

exports.fonts = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.woff$/,
          loader: 'url',
          include: paths,
          query: {
            limit: 50000
          }
        }
      ]
    }
  };
};

exports.translateVariables = function (varMapping) {
  return {
    plugins: [
      new webpack.DefinePlugin(varMapping)
    ]
  };
};
