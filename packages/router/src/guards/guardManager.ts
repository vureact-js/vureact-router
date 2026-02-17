import type { RouteLocation } from '../hooks/useRoute';
import type { NavigationFailure } from '../navigationFailure';
import { createNavigationFailure } from '../navigationFailure';

export interface GlobalGuards {
  beforeEach: (guard: GuardWithNextFn) => () => void;
  beforeResolve: (guard: GuardWithNextFn) => () => void;
  afterEach: (guard: AfterEachGuard) => () => void;
  onError: (handler: ErrorHandler) => () => void;
}

export interface ExclusiveGuards {
  beforeEnter?: GuardWithNextFn | Array<GuardWithNextFn>;
}

export interface ComponentGuards {
  id: string;
  guard: NonNextFnGuard<boolean | void>;
}

export type GuardWithNextFn = (
  to: GuardRouteLocation,
  from: GuardRouteLocation,
  next: (result?: Result) => void,
) => any | Promise<any>;

export type NonNextFnGuard<T = void> = (
  to: GuardRouteLocation,
  from: GuardRouteLocation,
) => T | Promise<T>;

export type AfterEachGuard = (
  to: GuardRouteLocation,
  from: GuardRouteLocation,
  failure?: NavigationFailure,
) => void;

export type ErrorHandler = (error: unknown) => void;

type Result = boolean | string | Partial<GuardRouteLocation> | Error;

export type GuardRouteLocation = RouteLocation;

type GlobalGuardsName = 'beforeEachGuards' | 'beforeResolveGuards' | 'afterEachGuards';

type ComponentGuardsName =
  | 'beforeRouteLeaveGuards'
  | 'beforeRouteUpdateGuards'
  | 'beforeRouteEnterGuards';

interface GuardTransitionSnapshot {
  to: GuardRouteLocation;
  from: GuardRouteLocation;
  failure?: NavigationFailure;
}

export class GuardManagerImpl {
  private beforeEachGuards: GuardWithNextFn[] = [];
  private beforeResolveGuards: GuardWithNextFn[] = [];
  private afterEachGuards: AfterEachGuard[] = [];

  private beforeRouteLeaveGuards: ComponentGuards[] = [];
  private beforeRouteUpdateGuards: ComponentGuards[] = [];
  private beforeRouteEnterGuards: ComponentGuards[] = [];

  private errorHandlers: ErrorHandler[] = [];

  private guardIdCounter = 0;

  private latestTransition?: GuardTransitionSnapshot;

  registerGuard(name: GlobalGuardsName, guard: GuardWithNextFn | AfterEachGuard): () => void {
    // @ts-expect-error runtime guard list index
    this[name].push(guard);

    return () => {
      const list = this[name] as Array<typeof guard>;
      const idx = list.indexOf(guard);
      if (idx >= 0) {
        list.splice(idx, 1);
      }
    };
  }

  registerOnError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      const idx = this.errorHandlers.indexOf(handler);
      if (idx >= 0) {
        this.errorHandlers.splice(idx, 1);
      }
    };
  }

  emitError(error: unknown) {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch {
        // ignore secondary errors
      }
    });
  }

  setLatestTransition(snapshot: GuardTransitionSnapshot) {
    this.latestTransition = snapshot;
  }

  getLatestTransition(): GuardTransitionSnapshot | undefined {
    return this.latestTransition;
  }

  registerComponentGuard(name: ComponentGuardsName, guard: ComponentGuards['guard']): () => void {
    const id = `${name}_${this.guardIdCounter++}`;
    const handler = { id, guard };

    this[name].push(handler);

    return () => {
      const index = this[name].findIndex((h) => h.id === id);
      if (index > -1) {
        this[name].splice(index, 1);
      }
    };
  }

  private normalizeGuardResult(result: unknown): Result | true {
    if (result === undefined || result === true) {
      return true;
    }

    if (result instanceof Error) {
      return result;
    }

    if (result === false || typeof result === 'string' || typeof result === 'object') {
      return result as Result;
    }

    return true;
  }

  private async executeGuard(
    guard: GuardWithNextFn | NonNextFnGuard,
    to: GuardRouteLocation,
    from: GuardRouteLocation,
    needNextFn: boolean,
  ): Promise<Result | true> {
    if (!needNextFn) {
      try {
        const value = await (guard as NonNextFnGuard)(to, from);
        return this.normalizeGuardResult(value);
      } catch (error) {
        this.emitError(error);
        return error instanceof Error ? error : new Error(String(error));
      }
    }

    return new Promise<Result | true>((resolve) => {
      let settled = false;
      let nextCalled = false;

      const settle = (value: unknown) => {
        if (settled) return;
        settled = true;
        resolve(this.normalizeGuardResult(value));
      };

      const next = (value?: Result) => {
        nextCalled = true;
        settle(value);
      };

      try {
        const ret = (guard as GuardWithNextFn)(to, from, next);

        if (ret instanceof Promise) {
          ret
            .then((value) => {
              if (!nextCalled) {
                settle(value);
              }
            })
            .catch((error) => {
              this.emitError(error);
              settle(error instanceof Error ? error : new Error(String(error)));
            });
          return;
        }

        if (ret !== undefined && !nextCalled) {
          settle(ret);
          return;
        }

        Promise.resolve().then(() => {
          if (!nextCalled) {
            settle(true);
          }
        });
      } catch (error) {
        this.emitError(error);
        settle(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  private async executeGuardPipeline(
    guards: (GuardWithNextFn | NonNextFnGuard)[],
    to: GuardRouteLocation,
    from: GuardRouteLocation,
    needNextFn = true,
  ): Promise<Result | true> {
    for (const guard of guards) {
      const result = await this.executeGuard(guard, to, from, needNextFn);
      if (result !== true) {
        return result;
      }
    }

    return true;
  }

  async runBeforeEach(to: GuardRouteLocation, from: GuardRouteLocation): Promise<Result | true> {
    return this.executeGuardPipeline(this.beforeEachGuards, to, from);
  }

  async runBeforeEnter(
    to: GuardRouteLocation,
    from: GuardRouteLocation,
    beforeEnter?: ExclusiveGuards['beforeEnter'],
  ): Promise<Result | true | undefined> {
    if (!beforeEnter) {
      return undefined;
    }

    const guards = Array.isArray(beforeEnter) ? beforeEnter : [beforeEnter];
    return this.executeGuardPipeline(guards, to, from);
  }

  async runBeforeResolve(to: GuardRouteLocation, from: GuardRouteLocation): Promise<Result | true> {
    return this.executeGuardPipeline(this.beforeResolveGuards, to, from);
  }

  async runBeforeRouteLeave(
    to: GuardRouteLocation,
    from: GuardRouteLocation,
  ): Promise<Result | true> {
    return this.executeGuardPipeline(
      this.beforeRouteLeaveGuards.map(({ guard }) => guard),
      to,
      from,
      false,
    );
  }

  async runBeforeRouteUpdate(
    to: GuardRouteLocation,
    from: GuardRouteLocation,
  ): Promise<Result | true> {
    return this.executeGuardPipeline(
      this.beforeRouteUpdateGuards.map(({ guard }) => guard),
      to,
      from,
      false,
    );
  }

  async runBeforeRouteEnter(
    to: GuardRouteLocation,
    from: GuardRouteLocation,
  ): Promise<Result | true> {
    return this.executeGuardPipeline(
      this.beforeRouteEnterGuards.map(({ guard }) => guard),
      to,
      from,
      false,
    );
  }

  runAfterEach(
    to: GuardRouteLocation,
    from: GuardRouteLocation,
    failure?: NavigationFailure,
  ): void {
    this.afterEachGuards.forEach((guard) => {
      try {
        guard(to, from, failure);
      } catch (error) {
        this.emitError(error);
      }
    });

    this.setLatestTransition({ to, from, failure });
  }

  toFailure(result: Result, to: GuardRouteLocation, from: GuardRouteLocation): NavigationFailure {
    if (result === false) {
      return createNavigationFailure('aborted', {
        to,
        from,
        message: '[Router] Navigation aborted by guard.',
      });
    }

    if (
      typeof result === 'string' ||
      (result && typeof result === 'object' && !(result instanceof Error))
    ) {
      return createNavigationFailure('redirected', {
        to,
        from,
        message: '[Router] Navigation redirected by guard.',
      });
    }

    return createNavigationFailure('error', {
      to,
      from,
      error: result,
      message: '[Router] Navigation failed due to guard error.',
    });
  }

  clear() {
    this.beforeEachGuards.length = 0;
    this.beforeResolveGuards.length = 0;
    this.afterEachGuards.length = 0;
    this.errorHandlers.length = 0;
    this.guardIdCounter = 0;
    this.beforeRouteLeaveGuards.length = 0;
    this.beforeRouteUpdateGuards.length = 0;
    this.beforeRouteEnterGuards.length = 0;
    this.latestTransition = undefined;
  }
}
