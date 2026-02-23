import { isNavigationFailure, RouterLink, RouterView } from '@vureact/router';
import { useEffect, useRef, useState } from 'react';
import { routerInstance } from '../../router';

function DocGlobalGuardsExample() {
  const [authed, setAuthed] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const stateRef = useRef({ authed: false });

  useEffect(() => {
    stateRef.current.authed = authed;
  }, [authed]);

  useEffect(() => {
    const pushLog = (line: string) => {
      setLogs((prev) => [line, ...prev].slice(0, 12));
    };

    const offEach = routerInstance.beforeEach((to, _from, next) => {
      if (to.path === '/doc-examples/global-guards/protected' && !stateRef.current.authed) {
        next('/doc-examples/global-guards/login');
        return;
      }
      next();
    });

    const offResolve = routerInstance.beforeResolve((to, _from, next) => {
      pushLog(`beforeResolve => ${to.fullPath}`);
      next();
    });

    const offAfter = routerInstance.afterEach((to, _from, failure) => {
      const f = failure ? ` / failure=${failure.type} / ok=${String(isNavigationFailure(failure))}` : '';
      pushLog(`afterEach => ${to.fullPath}${f}`);
    });

    const offError = routerInstance.onError((error) => {
      pushLog(`onError => ${String(error)}`);
    });

    return () => {
      offEach();
      offResolve();
      offAfter();
      offError();
    };
  }, []);

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>Doc Example: Global Guards</h3>
        <button onClick={() => setAuthed((v) => !v)}>authed: {String(authed)}</button>
        <div className="demo-links">
          <RouterLink to="/doc-examples/global-guards/public">public</RouterLink>
          <RouterLink to="/doc-examples/global-guards/protected">protected</RouterLink>
          <RouterLink to="/doc-examples/global-guards/login">login</RouterLink>
        </div>
      </div>

      <div className="demo-panel">
        <RouterView />
      </div>

      <div className="demo-panel">
        <ul className="log">
          {logs.map((item, idx) => (
            <li key={`${item}_${idx}`}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DocGlobalPublic() {
  return <div>Global Guard Public Page</div>;
}

export function DocGlobalProtected() {
  return <div>Global Guard Protected Page</div>;
}

export function DocGlobalLogin() {
  return <div>Global Guard Login Page</div>;
}

export default DocGlobalGuardsExample;
