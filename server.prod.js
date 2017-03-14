/* eslint no-console: 0 */

const path = require( 'path' );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const HOST = process.env.npm_config_host ? process.env.npm_config_host : 'localhost';
const PORT = process.env.npm_config_port ? process.env.npm_config_port : 8005;

const server = express();

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
    Production server is running on \x1b[32m http://${HOST}:${PORT}
    \n\x1b[0m****************`
  );
} );
