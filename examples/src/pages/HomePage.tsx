import { RouterLink } from '@vureact/router';

function HomePage() {
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>示例说明</h3>
        <p>本工程直接通过 alias 引用本地 `packages/router/src`，可用于联调和 API 演示。</p>
      </div>
      <div className="demo-panel">
        <h3>六大场景入口</h3>
        <div className="demo-links">
          <RouterLink to="/basic-routing">01 基础路由</RouterLink>
          <RouterLink to="/router-link">02 RouterLink</RouterLink>
          <RouterLink to="/use-router-route">03 useRouter/useRoute</RouterLink>
          <RouterLink to="/global-guards">04 全局守卫</RouterLink>
          <RouterLink to="/component-guards">05 组件守卫</RouterLink>
          <RouterLink to="/dynamic-routes">06 动态路由</RouterLink>
          <RouterLink to="/doc-examples">07 文档示例集</RouterLink>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
