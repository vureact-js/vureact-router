import { RouterLink, useRouter } from '@vureact/router';
import { memo } from 'react';

function RouterLinkDemo() {
  const router = useRouter();

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>02 RouterLink</h3>
        <p>字符串跳转、对象跳转、query/hash、replace、customRender。</p>
      </div>
      <div className="demo-panel">
        <h3>普通跳转</h3>
        <div className="demo-links">
          <RouterLink to="/home">字符串 to</RouterLink>
          <RouterLink
            to={{ path: '/use-router-route', query: { tab: 'intro' }, hash: 'router-link' }}
          >
            对象 path + query + hash
          </RouterLink>
          <RouterLink to={{ name: 'use-router-route-detail', params: { id: '8' } }}>
            对象 name + params
          </RouterLink>
          <RouterLink to="/router-link" replace>
            replace 留在当前页
          </RouterLink>
        </div>
      </div>
      <div className="demo-panel">
        <h3>customRender</h3>
        <RouterLink
          to={{ path: '/use-router-route', query: { from: 'custom-render' } }}
          customRender={({ href, isActive, isExactActive, navigate }) => (
            <button onClick={navigate}>
              自定义按钮跳转 ({href}) / active:{String(isActive)} / exact:{String(isExactActive)}
            </button>
          )}
        />
      </div>
      <div className="demo-panel">
        <h3>编程式对比</h3>
        <button
          onClick={() => router.push({ path: '/use-router-route', query: { from: 'push-button' } })}
        >
          useRouter.push 跳转
        </button>
      </div>
    </div>
  );
}

export default memo(RouterLinkDemo);
