/* eslint no-console: 0 */

const path = require( 'path' );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const webpack = require( 'webpack' );
const webpackDevMiddleware = require( 'webpack-dev-middleware' );
const webpackHotMiddleware = require( 'webpack-hot-middleware' );

const devBuildConfig = require( './webpack.config' );

const HOST = process.env.npm_config_host ? process.env.npm_config_host : 'localhost';
const PORT = process.env.npm_config_port ? process.env.npm_config_port : 8005;

const server = express();
const compiler = webpack( devBuildConfig );

server.use( webpackDevMiddleware( compiler, {
  publicPath: devBuildConfig.output.publicPath,
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
  reload: true
} ) );

server.use( bodyParser.json() );
server.use( bodyParser.urlencoded( { extended: true } ) );

server.use( express.static( path.join( __dirname, 'web' ) ) );

server.use( '/', ( req, res ) => (
  res.sendFile( path.join( __dirname, 'web', 'index.html' ) )
) );

server.listen( PORT, HOST, ( err ) => {
  if ( err ) {
    console.log( `ERROR ${err}` );
  }

  console.log(
    `****************\n
    Dev server is running on \x1b[32m http://${HOST}:${PORT}
    \n\x1b[0m****************`
  );
} );
