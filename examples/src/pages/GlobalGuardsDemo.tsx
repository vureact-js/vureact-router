import { isNavigationFailure, RouterLink, RouterView } from '@vureact/router';
import { useEffect, useRef, useState } from 'react';
import { routerInstance } from '../router';

export function GlobalGuardTarget({ title, tip }: { title: string; tip: string }) {
  return (
    <div>
      <h4>{title}</h4>
      <p className="muted">{tip}</p>
    </div>
  );
}

function formatTime() {
  return new Date().toLocaleTimeString();
}

function GlobalGuardsDemo() {
  const [authed, setAuthed] = useState(false);
  const [blockBlockedPage, setBlockBlockedPage] = useState(false);
  const [throwOnErrorRoute, setThrowOnErrorRoute] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const guardStateRef = useRef({
    authed: false,
    blockBlockedPage: false,
    throwOnErrorRoute: false,
  });

  useEffect(() => {
    guardStateRef.current.authed = authed;
  }, [authed]);

  useEffect(() => {
    guardStateRef.current.blockBlockedPage = blockBlockedPage;
  }, [blockBlockedPage]);

  useEffect(() => {
    guardStateRef.current.throwOnErrorRoute = throwOnErrorRoute;
  }, [throwOnErrorRoute]);

  useEffect(() => {
    const pushLog = (line: string) => {
      setLogs((prev) => [`[${formatTime()}] ${line}`, ...prev].slice(0, 14));
    };

    const offBeforeEach = routerInstance.beforeEach((to, _from, next) => {
      if (to.path === '/global-guards/blocked' && guardStateRef.current.blockBlockedPage) {
        next(false);
        return;
      }

      if (to.path === '/global-guards/protected' && !guardStateRef.current.authed) {
        next('/global-guards/login');
        return;
      }

      if (to.path === '/global-guards/error' && guardStateRef.current.throwOnErrorRoute) {
        throw new Error('手动触发全局守卫错误');
      }

      next();
    });

    const offBeforeResolve = routerInstance.beforeResolve((to, _from, next) => {
      pushLog(`beforeResolve -> ${to.fullPath}`);
      next();
    });

    const offAfterEach = routerInstance.afterEach((to, _from, failure) => {
      const failureText = failure ? ` / failure=${failure.type}` : '';
      const failureCheck = failure ? ` / isNavigationFailure=${String(isNavigationFailure(failure))}` : '';
      pushLog(`afterEach -> ${to.fullPath}${failureText}${failureCheck}`);
    });

    const offError = routerInstance.onError((error) => {
      const msg = error instanceof Error ? error.message : String(error);
      pushLog(`onError -> ${msg}`);
    });

    pushLog('已注册 beforeEach / beforeResolve / afterEach / onError');

    return () => {
      offBeforeEach();
      offBeforeResolve();
      offAfterEach();
      offError();
    };
  }, []);

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>04 全局守卫</h3>
        <p>通过开关控制守卫行为：放行、重定向、阻断、抛错。</p>
        <div className="demo-actions">
          <button onClick={() => setAuthed((v) => !v)}>已登录: {String(authed)}</button>
          <button onClick={() => setBlockBlockedPage((v) => !v)}>
            阻断 blocked 页: {String(blockBlockedPage)}
          </button>
          <button className="danger" onClick={() => setThrowOnErrorRoute((v) => !v)}>
            error 路由抛错: {String(throwOnErrorRoute)}
          </button>
        </div>
      </div>

      <div className="demo-panel">
        <h3>导航目标</h3>
        <div className="demo-links">
          <RouterLink to="/global-guards/public">/public</RouterLink>
          <RouterLink to="/global-guards/protected">/protected</RouterLink>
          <RouterLink to="/global-guards/blocked">/blocked</RouterLink>
          <RouterLink to="/global-guards/error">/error</RouterLink>
          <RouterLink to="/global-guards/login">/login</RouterLink>
        </div>
      </div>

      <div className="demo-panel">
        <RouterView />
      </div>

      <div className="demo-panel">
        <h3>守卫日志</h3>
        {logs.length === 0 ? (
          <p className="muted">暂无日志</p>
        ) : (
          <ul className="log">
            {logs.map((line, idx) => (
              <li key={`${line}_${idx}`}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default GlobalGuardsDemo;
