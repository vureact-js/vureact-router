import { memo, useCallback, type ReactNode } from 'react';
import { useOutlet } from 'react-router-dom';
import { GuardExecutor } from '../guards/GuardExecutor';
import { RouteLocation, useRoute } from '../hooks/useRoute';

export interface RouterViewProps {
  // customRender 可以接收可选的 route 参数（守卫执行后的 route）
  customRender?: (component: ReactNode, route: RouteLocation) => ReactNode;
}

export default memo(RouterView);

/**
 * React adapter for Vue Router's component `<router-view>`.
 *
 * @see https://router-vureact.vercel.app/api/router-components.html
 */
function RouterView({ customRender }: RouterViewProps): ReactNode {
  // 手动获取路由试图
  const outlet = useOutlet();
  const route = useRoute();

  const render = useCallback(
    (outlet: ReactNode, finalRoute: RouteLocation) => customRender?.(outlet, finalRoute) ?? outlet,
    [customRender],
  );

  return <GuardExecutor {...{ route, outlet, render }} />;
}
