const HOST = process.env.npm_config_host;
const PORT = process.env.npm_config_port;
const PHP_SERVER = process.env.npm_config_php == 'true' ? true : false;
const NODE_ENV = process.env.NODE_ENV;

const webpack = require( 'webpack' );
const path = require( 'path' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const WebpackUglifyJsPlugin = require( 'webpack-uglify-js-plugin' );

// process.traceDeprecation = true;

const config = {};

config.devtool = 'cheap-source-map';

config.context = __dirname;

if ( NODE_ENV === 'development' ) {
  config.entry = {
    app: [ 'babel-polyfill', './app/app.js', 'webpack-hot-middleware/client' ],
    style: [ './app/styles/main.less', 'webpack-hot-middleware/client' ]
  };
} else {
  config.entry = {
    'app': [ 'babel-polyfill', './app/app.js' ],
    'style': './app/styles/main.less',
  };
}

let assetsPORT = PORT;
let publicPath = '/assets/';

if ( NODE_ENV === 'development' && PHP_SERVER ) {
  assetsPORT = +PORT + 1;

  publicPath = `http://${HOST}:${assetsPORT}/assets/`;
}

config.output = {
  path: path.resolve( __dirname, 'web/assets/' ),
  publicPath,
  filename: 'js/[name].js',
  chunkFilename: 'js/[id].chunk.js'
};

config.resolve = {
  modules: [
    path.resolve( __dirname, 'app', 'libraries' ),
    path.resolve( __dirname, 'node_modules' )
  ],
  extensions: [ '.js' ],
  // alias: {
  //   'jquery': './app/libraries/jquery.min.js'
  // }
};

config.plugins = [
  new ExtractTextPlugin( { filename: 'css/[name].css', allChunks: true } ),
  // new webpack.ProvidePlugin( {
  //   $: 'jquery',
  //   jQuery: 'jquery',
  //   'window.jQuery': 'jquery',
  // } )
];

if ( NODE_ENV === 'development' ) {
  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin( { filename: 'css/[name].css', allChunks: true } ),
    // new webpack.ProvidePlugin( {
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery',
    // } ),
  ];

  config.plugins = plugins.concat( config.plugins );
} else if ( NODE_ENV === 'production' ) {
  config.plugins.push(
    new WebpackUglifyJsPlugin( {
      cacheFolder: path.resolve( __dirname, 'web/assets/cached_uglify/' ),
      debug: true,
      minimize: true,
      sourceMap: false,
      output: {
        comments: false
      },
      compressor: {
        warnings: false
      }
    } )
  );
}

config.module = {
  rules: [
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.js?$/,
      exclude: [ /node_modules/, /libraries/ ],
      loader: 'babel-loader',
      query: {
        presets: [
          [ 'es2015', { loose: true, modules: false } ]
        ]
      }
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract( {
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      } )
    },
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract( {
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      } )
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract( {
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader'
          }
        ]
      } )
    },
  ]
};

config.node = {
  console: true,
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
};

module.exports = config;
