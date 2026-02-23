import { RouterLink, RouterView, useRoute } from '@vureact/router';
import { useMemo } from 'react';
import { routerInstance } from '../router';

function RuntimeTopPage() {
  return <div>这是运行时注入的顶层路由页面。</div>;
}

function RuntimeChildPage() {
  return <div>这是运行时注入到 parent 的子路由页面。</div>;
}

export function DynamicRuntimeContainer() {
  const route = useRoute();
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h4>运行时父路由容器</h4>
        <p className="muted">当前路径: {route.fullPath}</p>
      </div>
      <div className="demo-panel">
        <RouterView />
      </div>
    </div>
  );
}

function DynamicRoutesDemo() {
  const topAdded = routerInstance.hasRoute('runtime-top');
  const childAdded = routerInstance.hasRoute('runtime-child');

  const resolved = useMemo(
    () =>
      routerInstance.resolve({
        path: '/dynamic-routes/runtime/child',
        query: { from: 'resolve' },
        hash: 'demo',
      }),
    [],
  );

  const addTop = async () => {
    if (!routerInstance.hasRoute('runtime-top')) {
      routerInstance.addRoute({
        path: '/dynamic-routes/runtime-top',
        name: 'runtime-top',
        component: <RuntimeTopPage />,
      });
    }
    await routerInstance.router.navigate('/dynamic-routes/runtime-top');
  };

  const addChild = async () => {
    if (!routerInstance.hasRoute('runtime-child')) {
      routerInstance.addRoute('dynamic-runtime-parent', {
        path: 'child',
        name: 'runtime-child',
        component: <RuntimeChildPage />,
      });
    }
    await routerInstance.router.navigate('/dynamic-routes/runtime/child');
  };

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>06 动态路由</h3>
        <p>演示 addRoute、hasRoute、resolve 与注入后立即导航。</p>
        <div className="demo-actions">
          <button onClick={addTop}>addRoute 顶层 + 跳转</button>
          <button onClick={addChild}>addRoute 子路由 + 跳转</button>
        </div>
      </div>

      <div className="demo-panel">
        <h3>hasRoute 状态</h3>
        <ul className="log">
          <li>runtime-top: {String(topAdded)}</li>
          <li>runtime-child: {String(childAdded)}</li>
        </ul>
      </div>

      <div className="demo-panel">
        <h3>resolve 结果</h3>
        <p>
          path: <code>{resolved.path}</code>
        </p>
        <p>
          fullPath: <code>{resolved.fullPath}</code>
        </p>
        <div className="demo-links">
          <RouterLink to={resolved.fullPath}>按 resolve 结果跳转</RouterLink>
          <RouterLink to="/dynamic-routes/runtime">访问运行时父容器</RouterLink>
        </div>
      </div>
    </div>
  );
}

export default DynamicRoutesDemo;
