import { RouterLink, useRoute } from '@vureact/router';

function AppNotFound() {
  const route = useRoute();

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>404 未匹配路由</h3>
        <p>
          未匹配地址: <code>{route.fullPath}</code>
        </p>
        <div className="demo-links">
          <RouterLink to="/home">返回首页</RouterLink>
          <RouterLink to="/basic-routing">回到基础路由示例</RouterLink>
        </div>
      </div>
    </div>
  );
}

export default AppNotFound;
