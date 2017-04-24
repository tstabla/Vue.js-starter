/* global ga fbq */

const Vue = require( 'vue.js' );
const VueRouter = require( 'vue-router.js' );
const VueResource = require( 'vue-resource.js' );
const VeeValidate = require( 'vee-validate.min.js' );

Vue.use( VueRouter );
Vue.use( VueResource );
Vue.use( VeeValidate );

const Page = ( htmlFileSource, jsFileName, resolve, reason ) => {
  let path = `/views/${htmlFileSource}.php?v=${window.assetsVersion}`;

  if ( typeof htmlFileSource === 'object' ) {
    path = `/views${htmlFileSource.base}${htmlFileSource.name}.php?v=${window.assetsVersion}`;
  }

  Vue.http.get( path ).then( ( response ) => {
    const file = jsFileName ? require( `bundle-loader!./views/${jsFileName}.js` ) : null;

    if ( !response.body.match( /(default\-page)/g ) ) {
      reason( 'page not found' );

      return;
    }

    if ( file ) {
      file( ( data ) => {
        const dataObj = {
          extends : data( App ),
          template: response.body
        };

        resolve( dataObj );
      } );
    } else {
      const dataObj = {
        template: response.body
      };

      resolve( dataObj );
    }
  }, ( response ) => {
    // error callback
  } );
};

const Route = ( jsFileName, to, from, next ) => {
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
    const basePath = to.path.slice( 0, basePathIndex );

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
};

const routes = [
  {
    path     : '/',
    name     : 'index',
    component: Page.bind( null, 'index', null ) // htmlFileSource - jsFileName
  },
  {
    path     : '/subpage',
    name     : 'subpage-1',
    component: Page.bind( null, 'subpage', 'subpage-1' ) // htmlFileSource - jsFileName
  },
  {
    path     : '/subpage/:pageName',
    beforeEnter: Route.bind( null, 'subpage-2' ) // jsFileName
  },
  {
    path     : '/404',
    name     : 'error-404',
    component: Page.bind( null, '404', null )
  },
  {
    path: '*',
    redirect: { name: 'error-404' }
  }
];

const router = new VueRouter( {
  mode: 'history',
  routes,
  linkActiveClass: 'is-active',
} );

Vue.config.silent = false;

const App = new Vue( {
  router,
  data() {
    return {};
  },
  methods: {},
  mounted() {
    this.$nextTick( () => {

    } );
  }
} ).$mount( '#app' );

router.afterEach( ( to, from ) => {
  setTimeout( () => {
    document.body.scrollTop = 0;

    if ( window.ga ) {
      ga( 'set', 'page', to.path );
      ga( 'send', 'pageview' );
    }

    if ( window.fbq ) {
      fbq( 'track', 'PageView' );
    }
  }, 100 );
} );
