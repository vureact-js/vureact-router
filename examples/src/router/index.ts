import { createRouter, createWebHashHistory } from '@vureact/router';
import routes from './routes';

export const routerInstance = createRouter({
  routes,
  history: createWebHashHistory(),
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
});
