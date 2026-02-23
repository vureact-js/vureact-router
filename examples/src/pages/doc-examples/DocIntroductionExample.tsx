import { RouterLink } from '@vureact/router';

function DocIntroductionExample() {
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>Doc Example: Introduction</h3>
        <p>展示 RouterProvider + RouterLink + RouterView 的基础协作。</p>
      </div>
      <div className="demo-panel">
        <div className="demo-links">
          <RouterLink to="/home">Go Home</RouterLink>
          <RouterLink to="/doc-examples/quick-start">Go Quick Start Example</RouterLink>
          <RouterLink to="/doc-examples/use-router-use-route">Go useRouter/useRoute Example</RouterLink>
        </div>
      </div>
      <div className="demo-panel">
        <p className="muted">
          对应文档章节：<code>docs/.../guide/introduction.md</code>
        </p>
      </div>
    </div>
  );
}

export default DocIntroductionExample;
