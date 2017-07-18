import Vue from 'vue.js';
import VueRouter from 'vue-router.js';
import PageLoader from './app-page-loader.js';

Vue.use( VueRouter );
Vue.use( PageLoader, {
  tmplPath: '/views/',
  fileExt: '.php'
} );

const routes = [
  {
    path     : '/',
    name     : 'index',
    component: Vue.pageLoad.bind( null, 'index', null ) // htmlFileSource - jsFileName
  },
  {
    path     : '/subpage',
    name     : 'subpage-1',
    component: Vue.pageLoad.bind( null, 'subpage', 'subpage-1' ) // htmlFileSource - jsFileName
  },
  {
    path     : '/subpage/:pageName',
    beforeEnter: Vue.pageRoute.bind( null, 'subpage-2' ) // jsFileName
  },
  {
    path     : '/404',
    name     : 'error-404',
    component: Vue.pageLoad.bind( null, 'views/404', null )
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

export default router;
