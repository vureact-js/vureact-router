import { createMemoryHistory, createWebHashHistory, createWebHistory, RouterLink } from '@vureact/router';

function DocHistoryModesExample() {
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>Doc Example: History Modes</h3>
        <p>RouterMode = hash | history | memoryHistory</p>
      </div>

      <div className="demo-panel">
        <ul className="log">
          <li>createWebHashHistory() =&gt; {createWebHashHistory()}</li>
          <li>createWebHistory() =&gt; {createWebHistory()}</li>
          <li>createMemoryHistory() =&gt; {createMemoryHistory()}</li>
          <li>createRouter 默认 history: hash</li>
        </ul>
      </div>

      <div className="demo-panel">
        <div className="demo-links">
          <RouterLink to="/home">back home</RouterLink>
          <RouterLink to="/doc-examples/quick-start">go quick-start</RouterLink>
        </div>
      </div>
    </div>
  );
}

export default DocHistoryModesExample;
