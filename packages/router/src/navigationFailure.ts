export type NavigationFailureType =
  | 'aborted'
  | 'redirected'
  | 'cancelled'
  | 'duplicated'
  | 'error';

export interface NavigationFailure {
  readonly _isNavigationFailure: true;
  type: NavigationFailureType;
  to?: unknown;
  from?: unknown;
  message?: string;
  error?: unknown;
}

export function createNavigationFailure(
  type: NavigationFailureType,
  options: Omit<NavigationFailure, '_isNavigationFailure' | 'type'> = {},
): NavigationFailure {
  return {
    _isNavigationFailure: true,
    type,
    ...options,
  };
}

export function isNavigationFailure(value: unknown): value is NavigationFailure {
  return Boolean(
    value &&
      typeof value === 'object' &&
      (value as { _isNavigationFailure?: boolean })._isNavigationFailure,
  );
}
