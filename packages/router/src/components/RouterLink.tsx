import { memo, PropsWithChildren, useMemo } from 'react';
import {
  Link,
  useMatch,
  useNavigate,
  useResolvedPath,
  type LinkProps,
  type To,
} from 'react-router-dom';
import { type RouterOptions } from '../hooks/useRouter';
import { getRuntimeRouterConfig } from '../runtimeConfig';
import { buildSearchParams, resolvedPath } from '../utils';

export type RouterLinkProps = Omit<LinkProps, 'to'> & RouterLinkBaseProps;

export interface RouterLinkBaseProps {
  to: string | RouterOptions;
  replace?: boolean;
  customRender?: LinkCustomRender;
  custom?: LinkCustomRender;
  inActiveClassName?: string;
  activeClassName?: string;
  exactActiveClassName?: string;
  activeClass?: string;
  exactActiveClass?: string;
}

export type LinkCustomRender = (props: CustomRenderProps) => React.ReactNode;

export type CustomRenderProps = {
  href: string;
  isActive: boolean;
  isExactActive: boolean;
  navigate: () => void;
};

export default memo(RouterLink);

/**
 * React adapter for Vue Router's component `<router-link>`.
 * @see https://router.vureact.top/guide/router-link.html
 */
function RouterLink(props: PropsWithChildren<RouterLinkProps>) {
  const {
    to,
    replace = false,
    customRender,
    custom,
    children,
    activeClassName = '',
    activeClass,
    inActiveClassName = '',
    exactActiveClassName = '',
    exactActiveClass,
    ...restProps
  } = props;

  // 获取运行时配置，用于获取默认的激活类名
  const runtimeConfig = getRuntimeRouterConfig();

  // 处理 to 属性：如果是字符串，直接作为导航链接；如果是对象，需要进一步处理
  const navLink = useMemo(() => (typeof to === 'string' ? to : ''), [to]);

  // 处理对象类型的 to 属性，构建 react-router-dom 的导航选项
  const navOptions = useMemo<To & { state?: any }>(() => {
    if (typeof to !== 'object') {
      return {};
    }

    const normalized = { ...to };
    // 如果同时有 path 和 params，优先使用 path，清除 params
    if (normalized.path && normalized.params) {
      normalized.params = undefined;
    }

    return {
      hash: normalized.hash,
      state: normalized.state,
      pathname: resolvedPath(normalized), // 解析路径，处理动态参数
      search: buildSearchParams(normalized.query), // 构建查询字符串
    };
  }, [to]);

  const navigate = useNavigate();
  // 解析路径，确保路径是绝对路径
  const resolved = useResolvedPath(navLink || navOptions);

  const { state } = navOptions;

  // 检查当前链接是否精确匹配（完全匹配路径）
  const isExactActive = Boolean(useMatch({ path: resolved.pathname, end: true }));
  // 检查当前链接是否激活（路径前缀匹配）
  const isActive = Boolean(useMatch({ path: resolved.pathname, end: false }));

  // 确定最终的激活类名：优先使用 props 中的类名，否则使用运行时配置的默认类名
  const finalExactActiveClass =
    exactActiveClassName || exactActiveClass || runtimeConfig.linkExactActiveClass;
  const finalActiveClass = activeClassName || activeClass || runtimeConfig.linkActiveClass;

  // 构建最终的 className：根据激活状态添加相应的类名
  const className = useMemo(
    () =>
      [
        restProps.className,
        isExactActive ? finalExactActiveClass : '', // 精确激活时添加精确激活类
        isActive ? finalActiveClass : '', // 激活时添加激活类
        !isActive && !isExactActive ? inActiveClassName : '', // 未激活时添加非激活类
      ]
        .filter(Boolean) // 过滤空字符串
        .join(' '),
    [
      restProps.className,
      isExactActive,
      finalExactActiveClass,
      isActive,
      finalActiveClass,
      inActiveClassName,
    ],
  );

  // 构建传递给 react-router-dom Link 组件的 props
  const linkProps = useMemo(
    () => ({
      to: navLink || navOptions,
      state,
      replace,
      ...restProps,
      className,
    }),
    [className, navLink, navOptions, replace, restProps, state],
  );

  // 构建自定义渲染函数的参数
  const customRenderProps = useMemo(() => {
    // 构建完整的 href 字符串（包含路径、查询参数和哈希）
    const href = navLink || resolved.pathname + (resolved.search ?? '') + (resolved.hash ?? '');
    // 创建导航回调函数
    const cb = () => navigate(navLink || navOptions, { replace, state });
    return {
      href,
      isActive,
      isExactActive,
      navigate: cb,
    };
  }, [isActive, isExactActive, navLink, navOptions, navigate, replace, resolved, state]);

  // 优先使用 customRender，其次使用 custom（兼容性别名）
  const customRenderer = customRender ?? custom;

  // 如果有自定义渲染函数，使用它；否则使用默认的 Link 组件
  return customRenderer?.(customRenderProps) || <Link {...linkProps}>{children}</Link>;
}
