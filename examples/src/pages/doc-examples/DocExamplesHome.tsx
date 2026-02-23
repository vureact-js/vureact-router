import { RouterLink } from '@vureact/router';

const links: Array<{ to: string; title: string; summary: string }> = [
  { to: '/doc-examples/introduction', title: '01 Introduction', summary: 'Router basics and mental model' },
  { to: '/doc-examples/quick-start', title: '02 Quick Start', summary: 'Minimal setup in React app' },
  { to: '/doc-examples/basic-routing', title: '03 Basic Routing', summary: 'Nested routes and fallback' },
  { to: '/doc-examples/router-link', title: '04 RouterLink', summary: 'String/object target and custom render' },
  { to: '/doc-examples/use-router-use-route', title: '05 useRouter/useRoute', summary: 'Imperative navigation and route state' },
  { to: '/doc-examples/global-guards', title: '06 Global Guards', summary: 'beforeEach / beforeResolve / afterEach / onError' },
  { to: '/doc-examples/component-guards', title: '07 Component Guards', summary: 'leave/update/enter guard hooks' },
  { to: '/doc-examples/dynamic-routing', title: '08 Dynamic Routing', summary: 'addRoute / hasRoute / resolve' },
  { to: '/doc-examples/history-modes', title: '09 History Modes', summary: 'hash / history / memoryHistory' },
];

function DocExamplesHome() {
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>文档章节独立示例</h3>
        <p>这些页面对应 docs 教程中的最小示例，每一章都可以在 examples 中单独运行验证。</p>
      </div>
      <div className="demo-panel">
        <div className="demo-links">
          {links.map((item) => (
            <RouterLink key={item.to} to={item.to}>
              {item.title}
            </RouterLink>
          ))}
        </div>
      </div>
      <div className="demo-panel">
        <ul className="log">
          {links.map((item) => (
            <li key={`summary_${item.to}`}>
              <strong>{item.title}:</strong> {item.summary}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DocExamplesHome;
