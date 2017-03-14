/* global ga fbq */

const Vue = require( 'vue.js' );
const VueRouter = require( 'vue-router.js' );
const VueResource = require( 'vue-resource.js' );
const VeeValidate = require( 'vee-validate.min.js' );

Vue.use( VueRouter );
Vue.use( VueResource );
Vue.use( VeeValidate );

const Page = ( htmlFileName, jsFileName, resolve, reason ) => {
  Vue.http.get( `/views/${htmlFileName}.html?v=${window.assetsVersion}` ).then( ( response ) => {
    const file = jsFileName ? require( `bundle-loader!./views/${jsFileName}.js` ) : null;

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

const routes = [
  {
    path     : '/',
    name     : 'index',
    component: Page.bind( null, 'index', null )
  },
  {
    path     : '/page-1',
    name     : 'subpage-1',
    component: Page.bind( null, 'subpage-1', 'subpage-1' )
  },
  {
    path     : '/page-2',
    name     : 'subpage-2',
    component: Page.bind( null, 'subpage-2', 'subpage-2' )
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
