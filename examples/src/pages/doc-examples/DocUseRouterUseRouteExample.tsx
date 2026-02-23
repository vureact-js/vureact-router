import { useMemo } from 'react';
import { RouterLink, useRoute, useRouter } from '@vureact/router';

function DocUseRouterUseRouteExample() {
  const router = useRouter();
  const route = useRoute();

  const resolved = useMemo(
    () =>
      router.resolve({
        name: 'use-router-route-detail',
        params: { id: '99' },
        query: { tab: 'doc' },
        hash: 'panel',
      }),
    [router],
  );

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>Doc Example: useRouter/useRoute</h3>
        <div className="demo-actions">
          <button onClick={() => router.push('/home')}>push</button>
          <button onClick={() => router.replace('/doc-examples/use-router-use-route?mode=replace')}>replace</button>
          <button onClick={() => router.back()}>back</button>
          <button onClick={() => router.forward()}>forward</button>
          <button onClick={() => router.go(-1)}>go(-1)</button>
        </div>
      </div>

      <div className="demo-panel">
        <ul className="log">
          <li>name: {route.name || '(empty)'}</li>
          <li>path: {route.path}</li>
          <li>fullPath: {route.fullPath}</li>
          <li>params: {JSON.stringify(route.params)}</li>
          <li>query: {JSON.stringify(route.query)}</li>
          <li>meta: {JSON.stringify(route.meta)}</li>
        </ul>
      </div>

      <div className="demo-panel">
        <p>resolve.fullPath: <code>{resolved.fullPath}</code></p>
        <p>current: <code>{router.current}</code></p>
        <RouterLink to={resolved.fullPath}>jump to resolved target</RouterLink>
      </div>
    </div>
  );
}

export default DocUseRouterUseRouteExample;
