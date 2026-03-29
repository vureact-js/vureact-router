import type { NavigateOptions, Params } from 'react-router-dom';

export interface RouteLocationOptions extends NavigateOptions {
  path?: string;
  name?: string;
  params?: Params;
  replace?: boolean;
  state?: any;
  hash?: string;
  query?: Record<string, any>;
}

export type RouteLocationRaw = string | RouteLocationOptions;
