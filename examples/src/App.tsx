import { RouterLink, RouterView, useRoute } from '@vureact/router';

function App() {
  const route = useRoute();

  const summaries: Array<{ key: string; summary: string }> = [
    { key: '/doc-examples', summary: '文档章节拆分后的独立示例页面集合' },
    { key: '/basic-routing', summary: '基础路由、嵌套路由与 404 兜底' },
    { key: '/router-link', summary: 'RouterLink 多种跳转写法与 customRender' },
    { key: '/use-router-route', summary: 'useRouter / useRoute 交互式展示' },
    { key: '/global-guards', summary: 'beforeEach / beforeResolve / afterEach / onError' },
    {
      key: '/component-guards',
      summary: 'beforeRouteLeave / beforeRouteUpdate / beforeRouteEnter',
    },
    { key: '/dynamic-routes', summary: 'addRoute / hasRoute / resolve 运行时路由能力' },
  ];

  const summary =
    summaries.find((item) => route.path.startsWith(item.key))?.summary ??
    '示例首页：选择左侧任一场景开始演示。';

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <h1>@vureact/router</h1>
        <p>Examples</p>
        <nav className="app-nav">
          <RouterLink to="/home" inActiveClassName="link-inactive">
            首页
          </RouterLink>
          <RouterLink to="/basic-routing" inActiveClassName="link-inactive">
            01 基础路由
          </RouterLink>
          <RouterLink to="/router-link" inActiveClassName="link-inactive">
            02 RouterLink
          </RouterLink>
          <RouterLink to="/use-router-route" inActiveClassName="link-inactive">
            03 useRouter/useRoute
          </RouterLink>
          <RouterLink to="/global-guards" inActiveClassName="link-inactive">
            04 全局守卫
          </RouterLink>
          <RouterLink to="/component-guards" inActiveClassName="link-inactive">
            05 组件守卫
          </RouterLink>
          <RouterLink to="/dynamic-routes" inActiveClassName="link-inactive">
            06 动态路由
          </RouterLink>
          <RouterLink to="/doc-examples" inActiveClassName="link-inactive">
            07 文档示例集
          </RouterLink>
        </nav>
      </aside>
      <main className="app-main">
        <header className="app-header">
          <h2>{summary}</h2>
          <p>
            当前地址: <code>{route.fullPath}</code>
          </p>
          <div className="quick-links">
            <RouterLink to="/home" inActiveClassName="link-inactive">
              首页
            </RouterLink>
            <RouterLink to="/router-link" inActiveClassName="link-inactive">
              RouterLink
            </RouterLink>
            <RouterLink to="/global-guards/public" inActiveClassName="link-inactive">
              守卫目标页
            </RouterLink>
            <RouterLink to="/doc-examples" inActiveClassName="link-inactive">
              文档示例
            </RouterLink>
          </div>
        </header>
        <section className="content-card">
          <RouterView />
        </section>
      </main>
    </div>
  );
}

export default App;
