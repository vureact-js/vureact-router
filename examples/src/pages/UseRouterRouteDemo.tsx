import { useMemo } from 'react';
import { RouterLink, useRoute, useRouter } from '@vureact/router';

function UseRouterRouteDemo() {
  const router = useRouter();
  const route = useRoute();

  const resolved = useMemo(
    () =>
      router.resolve({
        name: 'use-router-route-detail',
        params: { id: '99' },
        query: { tab: 'stats' },
        hash: 'panel',
      }),
    [router],
  );

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>03 useRouter / useRoute</h3>
        <div className="demo-actions">
          <button onClick={() => router.push('/home')}>push /home</button>
          <button
            onClick={() =>
              router.push({
                path: '/use-router-route/12',
                query: { source: 'push', page: '2' },
                hash: 'viewer',
              })
            }
          >
            push 对象参数
          </button>
          <button onClick={() => router.replace('/use-router-route/33?mode=replace#current')}>
            replace 当前记录
          </button>
          <button onClick={() => router.back()}>back</button>
          <button onClick={() => router.forward()}>forward</button>
          <button onClick={() => router.go(-1)}>go(-1)</button>
        </div>
      </div>

      <div className="demo-panel">
        <h3>useRoute 输出</h3>
        <ul className="log">
          <li>
            <strong>name:</strong> {route.name || '(empty)'}
          </li>
          <li>
            <strong>path:</strong> {route.path}
          </li>
          <li>
            <strong>fullPath:</strong> {route.fullPath}
          </li>
          <li>
            <strong>params:</strong> {JSON.stringify(route.params)}
          </li>
          <li>
            <strong>query:</strong> {JSON.stringify(route.query)}
          </li>
          <li>
            <strong>hash:</strong> {route.hash || '(empty)'}
          </li>
          <li>
            <strong>meta:</strong> {JSON.stringify(route.meta)}
          </li>
          <li>
            <strong>matched:</strong> {JSON.stringify(route.matched)}
          </li>
        </ul>
      </div>

      <div className="demo-panel">
        <h3>resolve 结果</h3>
        <p>
          href: <code>{resolved.href}</code>
        </p>
        <p>
          fullPath: <code>{resolved.fullPath}</code>
        </p>
        <div className="demo-links">
          <RouterLink to={resolved.fullPath}>跳转到 resolve 结果</RouterLink>
        </div>
      </div>
    </div>
  );
}

export default UseRouterRouteDemo;
