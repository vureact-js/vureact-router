import {
  RouterLink,
  RouterView,
  useBeforeRouteEnter,
  useBeforeRouteLeave,
  useBeforeRouteUpdate,
  useRoute,
} from '@vureact/router';
import { useState } from 'react';

function DocComponentGuardsExample() {
  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>Doc Example: Component Guards</h3>
        <div className="demo-links">
          <RouterLink to="/doc-examples/component-guards/form">form</RouterLink>
          <RouterLink to="/doc-examples/component-guards/user/1">user/1</RouterLink>
          <RouterLink to="/doc-examples/component-guards/enter">enter</RouterLink>
        </div>
      </div>
      <div className="demo-panel">
        <RouterView customRender={(component) => component ?? <p className="muted">请选择子页面</p>} />
      </div>
    </div>
  );
}

export function DocGuardForm() {
  const [dirty, setDirty] = useState(false);

  useBeforeRouteLeave(() => {
    if (!dirty) return true;
    return window.confirm('Unsaved changes. Leave?');
  });

  return (
    <div>
      <h4>beforeRouteLeave</h4>
      <button onClick={() => setDirty(true)}>dirty=true</button>
      <button onClick={() => setDirty(false)}>dirty=false</button>
      <p>dirty: {String(dirty)}</p>
    </div>
  );
}

export function DocGuardUser() {
  const route = useRoute();
  const [logs, setLogs] = useState<string[]>([]);

  useBeforeRouteUpdate((to, from) => {
    setLogs((prev) => [`${String(from.params.id)} -> ${String(to.params.id)}`, ...prev].slice(0, 8));
    return true;
  });

  return (
    <div>
      <h4>beforeRouteUpdate</h4>
      <p>current id: {String(route.params.id)}</p>
      <div className="demo-links">
        <RouterLink to="/doc-examples/component-guards/user/1">1</RouterLink>
        <RouterLink to="/doc-examples/component-guards/user/2">2</RouterLink>
        <RouterLink to="/doc-examples/component-guards/user/3">3</RouterLink>
      </div>
      <ul className="log">
        {logs.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function DocGuardEnter() {
  const [log, setLog] = useState('waiting...');

  useBeforeRouteEnter((to, from) => {
    setLog(`enter: ${from.path} -> ${to.path}`);
    return true;
  });

  return (
    <div>
      <h4>beforeRouteEnter (experimental)</h4>
      <p>{log}</p>
    </div>
  );
}

export default DocComponentGuardsExample;
