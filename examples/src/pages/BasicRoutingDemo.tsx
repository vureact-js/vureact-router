import { RouterLink, RouterView, useRoute } from '@vureact/router';
import { memo } from 'react';

function BasicRoutingDemo() {
  const route = useRoute();

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>01 基础路由</h3>
        <p>展示普通页面、嵌套页面与应用级 404 兜底。当前路径: {route.path}</p>
        <div className="demo-links">
          <RouterLink to="/basic-routing">基础页</RouterLink>
          <RouterLink to="/basic-routing/nested/alpha">嵌套 Alpha</RouterLink>
          <RouterLink to="/basic-routing/nested/beta">嵌套 Beta</RouterLink>
          <RouterLink to="/unknown-route">触发全局 404</RouterLink>
        </div>
      </div>
      <div className="demo-panel">
        <h3>说明</h3>
        <p>嵌套路由入口挂在 `/basic-routing/nested`，该节点内部再由 `RouterView` 渲染子页面。</p>
      </div>
    </div>
  );
}

export function BasicNestedLayout() {
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>嵌套路由容器</h3>
        <div className="demo-links">
          <RouterLink to="/basic-routing/nested/alpha">alpha</RouterLink>
          <RouterLink to="/basic-routing/nested/beta">beta</RouterLink>
          <RouterLink to="/basic-routing/nested/unknown">未匹配子路由</RouterLink>
        </div>
      </div>
      <div className="demo-panel">
        <RouterView />
      </div>
    </div>
  );
}

export function BasicNestedAlpha() {
  return <div>alpha 页面: 用于演示基础嵌套渲染。</div>;
}

export function BasicNestedBeta() {
  return <div>beta 页面: 与 alpha 同级，通过父级 `RouterView` 注入。</div>;
}

export default memo(BasicRoutingDemo);
