/* global ga fbq */

import Vue from 'vue.js';
import VueRouter from 'vue-router.js';
import VueResource from 'vue-resource.js';
import VeeValidate from 'vee-validate.min.js';
import router from './app-router.js';

Vue.use( VueRouter );
Vue.use( VueResource );
Vue.use( VeeValidate );

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
