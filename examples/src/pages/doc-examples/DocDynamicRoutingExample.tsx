import { RouterLink, RouterView, useRoute } from '@vureact/router';
import { useMemo } from 'react';
import { routerInstance } from '../../router';

function DocRuntimeTop() {
  return <div>Doc Runtime Top Route</div>;
}

function DocRuntimeChild() {
  return <div>Doc Runtime Child Route</div>;
}

function DocDynamicRoutingExample() {
  const resolved = useMemo(
    () =>
      routerInstance.resolve({
        path: '/doc-examples/dynamic-routing/runtime/runtime-child',
        query: { from: 'resolve' },
      }),
    [],
  );

  const addTop = async () => {
    if (!routerInstance.hasRoute('doc-runtime-top')) {
      routerInstance.addRoute({
        path: '/doc-examples/dynamic-routing/runtime-top',
        name: 'doc-runtime-top',
        component: <DocRuntimeTop />,
      });
    }
    await routerInstance.router.navigate('/doc-examples/dynamic-routing/runtime-top');
  };

  const addChild = async () => {
    if (!routerInstance.hasRoute('doc-runtime-child')) {
      routerInstance.addRoute('doc-dynamic-parent', {
        path: 'runtime-child',
        name: 'doc-runtime-child',
        component: <DocRuntimeChild />,
      });
    }
    await routerInstance.router.navigate('/doc-examples/dynamic-routing/runtime/runtime-child');
  };

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>Doc Example: Dynamic Routing</h3>
        <div className="demo-actions">
          <button onClick={addTop}>add top route + navigate</button>
          <button onClick={addChild}>add child route + navigate</button>
        </div>
      </div>
      <div className="demo-panel">
        <ul className="log">
          <li>doc-runtime-top: {String(routerInstance.hasRoute('doc-runtime-top'))}</li>
          <li>doc-runtime-child: {String(routerInstance.hasRoute('doc-runtime-child'))}</li>
        </ul>
      </div>
      <div className="demo-panel">
        <p>
          resolve.fullPath: <code>{resolved.fullPath}</code>
        </p>
        <RouterLink to={resolved.fullPath}>navigate with resolved result</RouterLink>
      </div>
    </div>
  );
}

export function DocDynamicParentShell() {
  const route = useRoute();
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h4>Doc Dynamic Parent Shell</h4>
        <p>current: {route.fullPath}</p>
      </div>
      <div className="demo-panel">
        <RouterView />
      </div>
    </div>
  );
}

export default DocDynamicRoutingExample;
