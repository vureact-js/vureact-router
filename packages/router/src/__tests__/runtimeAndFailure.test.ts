import { createNavigationFailure, isNavigationFailure } from '../navigationFailure';
import {
  getRuntimeRouterConfig,
  registerRuntimeRouterConfig,
  resetRuntimeRouterConfig,
} from '../runtimeConfig';

describe('runtime config and failure utilities', () => {
  afterEach(() => {
    resetRuntimeRouterConfig();
  });

  it('should keep defaults when partial config is undefined', () => {
    const before = getRuntimeRouterConfig();

    registerRuntimeRouterConfig({
      linkActiveClass: undefined,
      linkExactActiveClass: undefined,
      parseQuery: undefined,
      stringifyQuery: undefined,
    });

    const after = getRuntimeRouterConfig();
    expect(after.linkActiveClass).toBe(before.linkActiveClass);
    expect(after.linkExactActiveClass).toBe(before.linkExactActiveClass);
    expect(after.parseQuery('?a=1&a=2')).toEqual({ a: ['1', '2'] });
    expect(after.stringifyQuery({ a: ['1', '2'] })).toBe('a=1&a=2');
  });

  it('should support custom parse/stringify and reset to defaults', () => {
    registerRuntimeRouterConfig({
      parseQuery: () => ({ custom: true }),
      stringifyQuery: () => 'custom=true',
      linkActiveClass: 'a',
      linkExactActiveClass: 'b',
    });

    const custom = getRuntimeRouterConfig();
    expect(custom.parseQuery('?x=1')).toEqual({ custom: true });
    expect(custom.stringifyQuery({ x: 1 })).toBe('custom=true');
    expect(custom.linkActiveClass).toBe('a');
    expect(custom.linkExactActiveClass).toBe('b');

    resetRuntimeRouterConfig();
    const reset = getRuntimeRouterConfig();
    expect(reset.linkActiveClass).toBe('router-link-active');
    expect(reset.linkExactActiveClass).toBe('router-link-exact-active');
    expect(reset.parseQuery('?x=1')).toEqual({ x: '1' });
    expect(reset.stringifyQuery({ x: 1 })).toBe('x=1');
  });

  it('should expose navigation failure helpers', () => {
    const failure = createNavigationFailure('aborted', { message: 'x' });

    expect(isNavigationFailure(failure)).toBe(true);
    expect(isNavigationFailure({})).toBe(false);
    expect(isNavigationFailure(null)).toBe(false);
  });
});
