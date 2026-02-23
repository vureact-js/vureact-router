import { RouterLink, RouterView, useRoute } from '@vureact/router';

function DocBasicRoutingExample() {
  const route = useRoute();
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>Doc Example: Basic Routing</h3>
        <p>当前路径: {route.fullPath}</p>
        <div className="demo-links">
          <RouterLink to="/doc-examples/basic-routing/alpha">alpha</RouterLink>
          <RouterLink to="/doc-examples/basic-routing/beta">beta</RouterLink>
          <RouterLink to="/doc-examples/basic-routing/not-found">触发子级 fallback</RouterLink>
        </div>
      </div>
      <div className="demo-panel">
        <RouterView customRender={(component) => component ?? <p className="muted">请选择一个子路由。</p>} />
      </div>
    </div>
  );
}

export function DocBasicAlpha() {
  return <div>alpha child page</div>;
}

export function DocBasicBeta() {
  return <div>beta child page</div>;
}

export default DocBasicRoutingExample;
