import Vue from 'vue.js';
import VueResource from 'vue-resource.js';
import router from './app-router.js';

Vue.use( VueResource );

const assetsVersion = window.assetsVersion || Date.now();

const tmplEl = document.querySelector( '.js-page-tmpl' );

const tmplCode =  tmplEl ? tmplEl.innerHTML : null;

const PageLoader = {
  installed: false,
  install( Vue, options ) {
    if ( !Vue.http ) throw console.error( 'First you need install vue-resource plugin' );

    if ( this.installed ) throw console.error( 'PageLoader is already installed' );

    const fileExt = options.fileExt || '';
    const tmplPath = options.tmplPath || '/';

    function Page( htmlFileSource, jsFileName, resolve, reason ) {
      let path = `${tmplPath}${htmlFileSource}${fileExt}?v=${assetsVersion}`;

      if ( typeof htmlFileSource === 'object' ) {
        path = `${tmplPath}${htmlFileSource.base}${htmlFileSource.name}${fileExt}?v=${assetsVersion}`;
      }

      function getContent( tmpl ) {
        const file = jsFileName ? require( `bundle-loader!./views/${jsFileName}.js` ) : null;

        if ( file ) {
          file( ( data ) => {
            const dataObj = {
              extends : data( Vue ),
              template: tmpl
            };

            resolve( dataObj );
          } );
        } else {
          const dataObj = {
            template: tmpl
          };

          resolve( dataObj );
        }
      }

      if ( router.currentRoute.name === null && tmplCode !== null ) {

        getContent( tmplCode );

        return;
      }

      Vue.http.get( path ).then( ( response ) => {
        if ( !response.body.match( /(js\-page\-tmpl)/g ) ) {
          reason( 'page not found' );

          return;
        }

        const parser = new DOMParser(),
          doc = parser.parseFromString( response.body, 'text/html' ),
          tmpl = doc.querySelector( '.js-page-tmpl' );

        getContent( tmpl );
      }, ( response ) => {

      } );
    }

    function Route( jsFileName, to, from, next ) {
      if ( !Route.cachedNames ) {
        Route.cachedNames = [];
      }

      for ( let name of Route.cachedNames ) {
        if ( to.params.pageName === name ) {
          next( { name: to.params.pageName } );

          return;
        }
      }

      const basePathIndex = ( to.path ).indexOf( to.params.pageName );

      let htmlFilePath = to.params.pageName;

      if ( basePathIndex !== -1 ) {
        const basePath = to.path.slice( 1, basePathIndex );

        htmlFilePath = {
          base: basePath,
          name: to.params.pageName
        };
      }

      new Promise( ( resolve, reject ) => {
        return Page.call( null, htmlFilePath, jsFileName, resolve, reject );
      } ).then( ( result ) => {
        if ( !result ) {
          next( { name: 'error-404' } );
        } else {
          router.addRoutes( [
            {
              name: to.params.pageName,
              path: to.fullPath,
              component: result
            }
          ] );

          Route.cachedNames.push( to.params.pageName );

          next( { name: to.params.pageName } );
        }
      }, ( reason ) => {
        next( { name: 'error-404' } );
      } );
    }

    Vue.pageLoad = Page;
    Vue.pageRoute = Route;

    this.installed = true;
  }
};

if ( typeof window !== 'undefined' && window.Vue ) {
  window.Vue.use( PageLoader );
}

export default PageLoader;
