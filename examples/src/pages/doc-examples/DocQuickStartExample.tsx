import { RouterLink, type RouteConfig } from '@vureact/router';

const quickStartRoutes: RouteConfig[] = [
  { path: '/', name: 'root', component: <div /> },
  { path: '/home', name: 'home', component: <div /> },
  { path: '/user/:id', name: 'user', component: <div /> },
];

function DocQuickStartExample() {
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>Doc Example: Quick Start</h3>
        <p>最小启动流程：定义 routes、挂载 RouterProvider、使用 RouterLink/RouterView。</p>
      </div>
      <div className="demo-panel">
        <h3>RouteConfig Snapshot</h3>
        <pre>{JSON.stringify(quickStartRoutes, null, 2)}</pre>
      </div>
      <div className="demo-panel">
        <h3>Navigation</h3>
        <div className="demo-links">
          <RouterLink to="/home">Home</RouterLink>
          <RouterLink to={{ name: 'use-router-route-detail', params: { id: '42' } }}>User 42</RouterLink>
          <RouterLink to="/doc-examples/basic-routing">Next: Basic Routing</RouterLink>
        </div>
      </div>
    </div>
  );
}

export default DocQuickStartExample;
