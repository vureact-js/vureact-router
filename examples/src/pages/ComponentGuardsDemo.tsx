import {
  RouterLink,
  RouterView,
  useBeforeRouteEnter,
  useBeforeRouteLeave,
  useBeforeRouteUpdate,
  useRoute,
} from '@vureact/router';
import { useMemo, useState } from 'react';

export function ComponentFormGuard() {
  const [dirty, setDirty] = useState(false);

  useBeforeRouteLeave(() => {
    if (!dirty) {
      return true;
    }
    return window.confirm('表单内容未保存，确认离开吗？');
  });

  return (
    <div>
      <h4>beforeRouteLeave</h4>
      <p className="muted">切换到其它子路由时将触发离开守卫。</p>
      <button onClick={() => setDirty(true)}>模拟编辑（dirty=true）</button>
      <button onClick={() => setDirty(false)}>重置 dirty=false</button>
      <p className={dirty ? 'warn' : 'ok'}>当前 dirty: {String(dirty)}</p>
    </div>
  );
}

export function ComponentUserGuard() {
  const route = useRoute();
  const [events, setEvents] = useState<string[]>([]);

  useBeforeRouteUpdate((to, from) => {
    setEvents((prev) => [`params.id ${String(from.params.id)} -> ${String(to.params.id)}`, ...prev].slice(0, 6));
    return true;
  });

  return (
    <div>
      <h4>beforeRouteUpdate</h4>
      <p>
        当前用户 ID: <code>{String(route.params.id)}</code>
      </p>
      <div className="demo-links">
        <RouterLink to="/component-guards/user/1">切到 ID=1</RouterLink>
        <RouterLink to="/component-guards/user/2">切到 ID=2</RouterLink>
        <RouterLink to="/component-guards/user/3">切到 ID=3</RouterLink>
      </div>
      <ul className="log">
        {events.map((event) => (
          <li key={event}>{event}</li>
        ))}
      </ul>
    </div>
  );
}

export function ComponentEnterGuard() {
  const [enterText, setEnterText] = useState('等待触发 beforeRouteEnter...');

  useBeforeRouteEnter((to, from) => {
    setEnterText(`组件进入完成: from=${from.path} -> to=${to.path}`);
    return true;
  });

  return (
    <div>
      <h4>beforeRouteEnter（实验）</h4>
      <p>{enterText}</p>
    </div>
  );
}

function ComponentGuardsDemo() {
  const route = useRoute();

  const hint = useMemo(() => {
    if (route.path.endsWith('/form')) return '当前展示 beforeRouteLeave。';
    if (route.path.includes('/user/')) return '当前展示 beforeRouteUpdate（同组件参数变化）。';
    if (route.path.endsWith('/enter')) return '当前展示 beforeRouteEnter（实验能力）。';
    return '请选择一个子场景。';
  }, [route.path]);

  return (
    <div className="demo-grid">
      <div className="demo-panel">
        <h3>05 组件守卫</h3>
        <p>{hint}</p>
        <div className="demo-links">
          <RouterLink to="/component-guards/form">form</RouterLink>
          <RouterLink to="/component-guards/user/1">user/:id</RouterLink>
          <RouterLink to="/component-guards/enter">enter</RouterLink>
        </div>
      </div>
      <div className="demo-panel">
        <RouterView
          customRender={(component) =>
            component ?? <p className="muted">尚未进入子页面，请点击上方子路由。</p>
          }
        />
      </div>
    </div>
  );
}

export default ComponentGuardsDemo;
