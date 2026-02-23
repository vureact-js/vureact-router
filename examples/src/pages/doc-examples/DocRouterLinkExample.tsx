import { RouterLink, useRouter } from '@vureact/router';

function DocRouterLinkExample() {
  const router = useRouter();

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>Doc Example: RouterLink</h3>
        <p>字符串 to、对象 to、active class、customRender。</p>
      </div>

      <div className="demo-panel">
        <div className="demo-links">
          <RouterLink to="/home">String to</RouterLink>
          <RouterLink to={{ path: '/use-router-route', query: { from: 'doc-link' }, hash: 'hash' }}>
            Object path + query + hash
          </RouterLink>
          <RouterLink to={{ name: 'use-router-route-detail', params: { id: '88' } }}>
            Object name + params
          </RouterLink>
        </div>
      </div>

      <div className="demo-panel">
        <RouterLink
          to={{ path: '/doc-examples/use-router-use-route', query: { from: 'custom' } }}
          customRender={({ href, isActive, navigate }) => (
            <button onClick={navigate}>customRender href={href} active={String(isActive)}</button>
          )}
        />
      </div>

      <div className="demo-panel">
        <button onClick={() => router.push('/doc-examples/history-modes')}>useRouter.push to history-modes</button>
      </div>
    </div>
  );
}

export default DocRouterLinkExample;
