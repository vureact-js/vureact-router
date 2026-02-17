export interface RuntimeRouterConfig {
  linkActiveClass: string;
  linkExactActiveClass: string;
  parseQuery: (search: string) => Record<string, any>;
  stringifyQuery: (query: Record<string, any>) => string;
}

function defaultParseQuery(search: string): Record<string, any> {
  const raw = search.startsWith('?') ? search.slice(1) : search;
  if (!raw) return {};

  const params = new URLSearchParams(raw);
  const query: Record<string, any> = {};

  params.forEach((value, key) => {
    if (key in query) {
      const current = query[key];
      query[key] = Array.isArray(current) ? [...current, value] : [current, value];
      return;
    }
    query[key] = value;
  });

  return query;
}

function defaultStringifyQuery(query: Record<string, any>): string {
  const params = new URLSearchParams();

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry != null) {
          params.append(key, String(entry));
        }
      });
      return;
    }
    params.append(key, String(value));
  });

  return params.toString();
}

const _RUNTIME_ROUTER_CONFIG_: RuntimeRouterConfig = {
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  parseQuery: defaultParseQuery,
  stringifyQuery: defaultStringifyQuery,
};

export function registerRuntimeRouterConfig(config: Partial<RuntimeRouterConfig>) {
  if (config.linkActiveClass !== undefined) {
    _RUNTIME_ROUTER_CONFIG_.linkActiveClass = config.linkActiveClass;
  }
  if (config.linkExactActiveClass !== undefined) {
    _RUNTIME_ROUTER_CONFIG_.linkExactActiveClass = config.linkExactActiveClass;
  }
  if (config.parseQuery !== undefined) {
    _RUNTIME_ROUTER_CONFIG_.parseQuery = config.parseQuery;
  }
  if (config.stringifyQuery !== undefined) {
    _RUNTIME_ROUTER_CONFIG_.stringifyQuery = config.stringifyQuery;
  }
}

export function getRuntimeRouterConfig(): Readonly<RuntimeRouterConfig> {
  return _RUNTIME_ROUTER_CONFIG_;
}

export function resetRuntimeRouterConfig() {
  _RUNTIME_ROUTER_CONFIG_.linkActiveClass = 'router-link-active';
  _RUNTIME_ROUTER_CONFIG_.linkExactActiveClass = 'router-link-exact-active';
  _RUNTIME_ROUTER_CONFIG_.parseQuery = defaultParseQuery;
  _RUNTIME_ROUTER_CONFIG_.stringifyQuery = defaultStringifyQuery;
}
