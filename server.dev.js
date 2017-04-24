/* eslint no-console: 0 */

const HOST = process.env.npm_config_host;
const PORT = process.env.npm_config_port;
const PHP_SERVER = process.env.npm_config_php == 'true' ? true : false;
const NODE_ENV = process.env.NODE_ENV;

const path = require( 'path' );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const webpack = require( 'webpack' );
const webpackDevMiddleware = require( 'webpack-dev-middleware' );
const webpackHotMiddleware = require( 'webpack-hot-middleware' );

const devBuildConfig = require( './webpack.config' );

const server = express();
const compiler = webpack( devBuildConfig );

let assetsPORT = PORT;
let publicPath = devBuildConfig.output.publicPath;

if ( PHP_SERVER ) {
  assetsPORT = +PORT + 1;

  publicPath = `http://${HOST}:${assetsPORT}/assets/`;

  const cors = require( 'cors' );

  server.use( cors() );
}

if ( NODE_ENV === 'development' ) {
  server.use( webpackDevMiddleware( compiler, {
    publicPath,
    contentBase: path.join( __dirname, 'web' ),
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true,
      hash: false,
      version: false,
      chunks: false,
      children: false,
    },
  } ) );

  server.use( webpackHotMiddleware( compiler, {
    path: '/__webpack_hmr',
    timeout: 20000,
    reload: true,
  } ) );
}

server.use( bodyParser.json() );

server.use( bodyParser.urlencoded( { extended: true } ) );

server.use( express.static( path.join( __dirname, 'web' ) ) );

if ( !PHP_SERVER ) {
  server.use( '/', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'web', 'index.html' ) );
  } );
}

server.listen( PHP_SERVER ? assetsPORT : PORT, HOST, ( err ) => {
  if ( err ) {
    console.log( `ERROR ${err}` );

    return;
  }

  if ( PHP_SERVER ) {
    console.log(
      `****************\n
      Dev server is running on \x1b[32m http://${HOST}:${PORT} \n\x1b[0m
      Assets server is running on \x1b[32m http://${HOST}:${assetsPORT}
        \n\x1b[0m****************`
        );
  } else {
    console.log(
      `****************\n
      Dev server is running on \x1b[32m http://${HOST}:${PORT}
        \n\x1b[0m****************`
        );
  }
} );
