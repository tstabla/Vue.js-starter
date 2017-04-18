const webpack = require( 'webpack' );
const path = require( 'path' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const WebpackUglifyJsPlugin = require( 'webpack-uglify-js-plugin' );

// process.traceDeprecation = true;

const config = {};

config.devtool = 'cheap-source-map';

config.context = __dirname;

if ( process.env.NODE_ENV === 'development' ) {
  config.entry = {
    app: [ 'babel-polyfill', './app/main.js', 'webpack-hot-middleware/client' ],
    style: [ './app/styles/main.less', 'webpack-hot-middleware/client' ]
  };
} else {
  config.entry = {
    'app': [ 'babel-polyfill', './app/main.js' ],
    'style': './app/styles/main.less',
  };
}

config.output = {
  path: path.resolve( __dirname, 'web/assets/' ),
  publicPath: '/assets/',
  filename: 'js/[name].js',
  chunkFilename: 'js/[id].chunk.js'
};

config.resolve = {
  modules: [ 'libraries', 'node_modules' ],
  extensions: [ '.js' ],
  alias: {
    'jquery': './app/libraries/jquery.min.js'
  }
};

config.plugins = [
  new ExtractTextPlugin( { filename: 'css/[name].css', allChunks: true } ),
  new webpack.ProvidePlugin( {
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  } )
];

if ( process.env.NODE_ENV === 'development' ) {
  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin( { filename: 'css/[name].css', allChunks: true } ),
    new webpack.ProvidePlugin( {
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    } ),
  ];

  config.plugins = plugins.concat( config.plugins );
} else if ( process.env.NODE_ENV === 'production' ) {
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
        use: 'css-loader!postcss-loader',
      } )
    },
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract( {
        fallback: 'style-loader',
        use: 'css-loader!less-loader',
      } )
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract( {
        fallback: 'style-loader',
        use: 'css-loader!postcss-loader!sass-loader',
      } )
    }
  ],
};

module.exports = config;
