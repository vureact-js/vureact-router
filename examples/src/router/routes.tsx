import { type RouteConfig, RouterView } from '@vureact/router';
import App from '../App';
import AppNotFound from '../pages/AppNotFound';
import BasicRoutingDemo, { BasicNestedAlpha, BasicNestedBeta, BasicNestedLayout } from '../pages/BasicRoutingDemo';
import ComponentGuardsDemo, {
  ComponentEnterGuard,
  ComponentFormGuard,
  ComponentUserGuard,
} from '../pages/ComponentGuardsDemo';
import DynamicRoutesDemo, { DynamicRuntimeContainer } from '../pages/DynamicRoutesDemo';
import GlobalGuardsDemo, { GlobalGuardTarget } from '../pages/GlobalGuardsDemo';
import HomePage from '../pages/HomePage';
import RouterLinkDemo from '../pages/RouterLinkDemo';
import UseRouterRouteDemo from '../pages/UseRouterRouteDemo';

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'layout',
    component: <App />,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'home', component: <HomePage /> },
      { path: 'router-link', name: 'router-link-demo', component: <RouterLinkDemo /> },
      {
        path: 'use-router-route',
        name: 'use-router-route',
        component: <UseRouterRouteDemo />,
        meta: { section: 'hooks', mode: 'overview' },
      },
      {
        path: 'use-router-route/:id',
        name: 'use-router-route-detail',
        component: <UseRouterRouteDemo />,
        meta: { section: 'hooks', mode: 'detail' },
      },
      {
        path: 'basic-routing',
        name: 'basic-routing-demo',
        component: <BasicRoutingDemo />,
      },
      {
        path: 'basic-routing/nested',
        name: 'basic-nested-layout',
        component: <BasicNestedLayout />,
        children: [
          { path: 'alpha', name: 'basic-nested-alpha', component: <BasicNestedAlpha /> },
          { path: 'beta', name: 'basic-nested-beta', component: <BasicNestedBeta /> },
          { path: '*', component: <div>basic-routing 子级未匹配，请返回 alpha/beta。</div> },
        ],
      },
      {
        path: 'global-guards',
        name: 'global-guards-demo',
        component: <GlobalGuardsDemo />,
        children: [
          {
            path: 'public',
            name: 'global-public',
            component: <GlobalGuardTarget title="公共页" tip="任何状态都允许访问。" />,
          },
          {
            path: 'protected',
            name: 'global-protected',
            component: <GlobalGuardTarget title="受保护页" tip="需要开启“已登录”开关。" />,
            meta: { requiresAuth: true },
          },
          {
            path: 'blocked',
            name: 'global-blocked',
            component: <GlobalGuardTarget title="可被拦截页" tip="可演示 next(false)。" />,
          },
          {
            path: 'error',
            name: 'global-error',
            component: <GlobalGuardTarget title="错误触发页" tip="可演示 onError + failure:error。" />,
          },
          {
            path: 'login',
            name: 'global-login',
            component: <GlobalGuardTarget title="登录页" tip="受保护路由未授权时将重定向到这里。" />,
          },
        ],
      },
      {
        path: 'component-guards',
        name: 'component-guards-demo',
        component: <ComponentGuardsDemo />,
        children: [
          { path: 'form', name: 'component-form', component: <ComponentFormGuard /> },
          { path: 'user/:id', name: 'component-user', component: <ComponentUserGuard /> },
          { path: 'enter', name: 'component-enter', component: <ComponentEnterGuard /> },
        ],
      },
      {
        path: 'dynamic-routes',
        name: 'dynamic-routes-demo',
        component: <DynamicRoutesDemo />,
      },
      {
        path: 'dynamic-routes/runtime',
        name: 'dynamic-runtime-parent',
        component: <DynamicRuntimeContainer />,
        children: [],
      },
      {
        path: 'dynamic-routes/runtime-shell',
        name: 'dynamic-runtime-shell',
        component: <RouterView />,
        children: [],
      },
      { path: '*', name: 'not-found', component: <AppNotFound /> },
    ],
  },
];

export default routes;
