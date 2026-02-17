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

  const runtimeConfig = getRuntimeRouterConfig();

  const navLink = useMemo(() => (typeof to === 'string' ? to : ''), [to]);

  const navOptions = useMemo<To & { state?: any }>(() => {
    if (typeof to !== 'object') {
      return {};
    }

    const normalized = { ...to };
    if (normalized.path && normalized.params) {
      normalized.params = undefined;
    }

    return {
      hash: normalized.hash,
      state: normalized.state,
      pathname: resolvedPath(normalized),
      search: buildSearchParams(normalized.query),
    };
  }, [to]);

  const navigate = useNavigate();
  const resolved = useResolvedPath(navLink || navOptions);

  const { state } = navOptions;

  const isExactActive = Boolean(useMatch({ path: resolved.pathname, end: true }));
  const isActive = Boolean(useMatch({ path: resolved.pathname, end: false }));

  const finalExactActiveClass =
    exactActiveClassName || exactActiveClass || runtimeConfig.linkExactActiveClass;
  const finalActiveClass = activeClassName || activeClass || runtimeConfig.linkActiveClass;

  const className = useMemo(
    () =>
      [
        restProps.className,
        isExactActive ? finalExactActiveClass : '',
        isActive ? finalActiveClass : '',
        !isActive && !isExactActive ? inActiveClassName : '',
      ]
        .filter(Boolean)
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

  const customRenderProps = useMemo(() => {
    const href = navLink || resolved.pathname + (resolved.search ?? '') + (resolved.hash ?? '');
    const cb = () => navigate(navLink || navOptions, { replace, state });
    return {
      href,
      isActive,
      isExactActive,
      navigate: cb,
    };
  }, [isActive, isExactActive, navLink, navOptions, navigate, replace, resolved, state]);

  const customRenderer = customRender ?? custom;

  return customRenderer?.(customRenderProps) || <Link {...linkProps}>{children}</Link>;
}
