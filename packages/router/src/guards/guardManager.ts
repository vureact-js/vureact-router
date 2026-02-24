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

/**
 * 守卫管理器实现类
 * 负责管理所有类型的路由守卫，包括全局守卫、路由独享守卫和组件内守卫
 * 提供守卫的注册、执行、错误处理等功能
 */
export class GuardManagerImpl {
  // 全局守卫列表
  private beforeEachGuards: GuardWithNextFn[] = [];
  private beforeResolveGuards: GuardWithNextFn[] = [];
  private afterEachGuards: AfterEachGuard[] = [];

  // 组件内守卫列表
  private beforeRouteLeaveGuards: ComponentGuards[] = [];
  private beforeRouteUpdateGuards: ComponentGuards[] = [];
  private beforeRouteEnterGuards: ComponentGuards[] = [];

  // 错误处理器列表
  private errorHandlers: ErrorHandler[] = [];

  // 守卫ID计数器，用于生成唯一ID
  private guardIdCounter = 0;

  // 最近的导航转换快照
  private latestTransition?: GuardTransitionSnapshot;

  /**
   * 注册全局守卫
   * @param name 守卫类型名称
   * @param guard 守卫函数
   * @returns 取消注册的函数
   */
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

  /**
   * 注册错误处理器
   * @param handler 错误处理函数
   * @returns 取消注册的函数
   */
  registerOnError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      const idx = this.errorHandlers.indexOf(handler);
      if (idx >= 0) {
        this.errorHandlers.splice(idx, 1);
      }
    };
  }

  /**
   * 触发错误处理
   * @param error 错误对象
   */
  emitError(error: unknown) {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch {
        // 忽略次要错误，避免错误处理过程中产生新错误
      }
    });
  }

  /**
   * 设置最近的导航转换快照
   * @param snapshot 转换快照
   */
  setLatestTransition(snapshot: GuardTransitionSnapshot) {
    this.latestTransition = snapshot;
  }

  /**
   * 获取最近的导航转换快照
   * @returns 转换快照或 undefined
   */
  getLatestTransition(): GuardTransitionSnapshot | undefined {
    return this.latestTransition;
  }

  /**
   * 注册组件内守卫
   * @param name 守卫类型名称
   * @param guard 守卫函数
   * @returns 取消注册的函数
   */
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

  /**
   * 规范化守卫返回结果
   * @param result 原始结果
   * @returns 规范化后的结果
   */
  private normalizeGuardResult(result: unknown): Result | true {
    // undefined 或 true 表示继续导航
    if (result === undefined || result === true) {
      return true;
    }

    // Error 对象直接返回
    if (result instanceof Error) {
      return result;
    }

    // false、字符串、对象作为有效结果返回
    if (result === false || typeof result === 'string' || typeof result === 'object') {
      return result as Result;
    }

    // 其他情况默认继续导航
    return true;
  }

  /**
   * 执行单个守卫
   * @param guard 守卫函数
   * @param to 目标路由
   * @param from 来源路由
   * @param needNextFn 是否需要 next 函数
   * @returns 守卫执行结果
   */
  private async executeGuard(
    guard: GuardWithNextFn | NonNextFnGuard,
    to: GuardRouteLocation,
    from: GuardRouteLocation,
    needNextFn: boolean,
  ): Promise<Result | true> {
    // 处理不带 next 函数的守卫
    if (!needNextFn) {
      try {
        const value = await (guard as NonNextFnGuard)(to, from);
        return this.normalizeGuardResult(value);
      } catch (error) {
        this.emitError(error);
        return error instanceof Error ? error : new Error(String(error));
      }
    }

    // 处理带 next 函数的守卫
    return new Promise<Result | true>((resolve) => {
      let settled = false; // 是否已解决
      let nextCalled = false; // next 是否被调用

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

        // 处理异步守卫
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

        // 处理同步返回值
        if (ret !== undefined && !nextCalled) {
          settle(ret);
          return;
        }

        // 如果没有调用 next 也没有返回值，默认继续
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

  /**
   * 执行守卫管道（按顺序执行多个守卫）
   * @param guards 守卫数组
   * @param to 目标路由
   * @param from 来源路由
   * @param needNextFn 是否需要 next 函数
   * @returns 执行结果
   */
  private async executeGuardPipeline(
    guards: (GuardWithNextFn | NonNextFnGuard)[],
    to: GuardRouteLocation,
    from: GuardRouteLocation,
    needNextFn = true,
  ): Promise<Result | true> {
    // 按顺序执行守卫，遇到非 true 结果立即返回
    for (const guard of guards) {
      const result = await this.executeGuard(guard, to, from, needNextFn);
      if (result !== true) {
        return result;
      }
    }

    return true;
  }

  /**
   * 执行全局前置守卫 (beforeEach)
   */
  async runBeforeEach(to: GuardRouteLocation, from: GuardRouteLocation): Promise<Result | true> {
    return this.executeGuardPipeline(this.beforeEachGuards, to, from);
  }

  /**
   * 执行路由独享守卫 (beforeEnter)
   */
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

  /**
   * 执行解析前守卫 (beforeResolve)
   */
  async runBeforeResolve(to: GuardRouteLocation, from: GuardRouteLocation): Promise<Result | true> {
    return this.executeGuardPipeline(this.beforeResolveGuards, to, from);
  }

  /**
   * 执行组件内离开守卫 (beforeRouteLeave)
   */
  async runBeforeRouteLeave(
    to: GuardRouteLocation,
    from: GuardRouteLocation,
  ): Promise<Result | true> {
    return this.executeGuardPipeline(
      this.beforeRouteLeaveGuards.map(({ guard }) => guard),
      to,
      from,
      false, // 组件内守卫不需要 next 函数
    );
  }

  /**
   * 执行组件内更新守卫 (beforeRouteUpdate)
   */
  async runBeforeRouteUpdate(
    to: GuardRouteLocation,
    from: GuardRouteLocation,
  ): Promise<Result | true> {
    return this.executeGuardPipeline(
      this.beforeRouteUpdateGuards.map(({ guard }) => guard),
      to,
      from,
      false, // 组件内守卫不需要 next 函数
    );
  }

  /**
   * 执行组件内进入守卫 (beforeRouteEnter)
   */
  async runBeforeRouteEnter(
    to: GuardRouteLocation,
    from: GuardRouteLocation,
  ): Promise<Result | true> {
    return this.executeGuardPipeline(
      this.beforeRouteEnterGuards.map(({ guard }) => guard),
      to,
      from,
      false, // 组件内守卫不需要 next 函数
    );
  }

  /**
   * 执行全局后置守卫 (afterEach)
   */
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

    // 记录最近的导航转换
    this.setLatestTransition({ to, from, failure });
  }

  /**
   * 将守卫结果转换为导航失败对象
   * @param result 守卫结果
   * @param to 目标路由
   * @param from 来源路由
   * @returns 导航失败对象
   */
  toFailure(result: Result, to: GuardRouteLocation, from: GuardRouteLocation): NavigationFailure {
    if (result === false) {
      // 中止导航
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
      // 重定向导航
      return createNavigationFailure('redirected', {
        to,
        from,
        message: '[Router] Navigation redirected by guard.',
      });
    }

    // 错误导航
    return createNavigationFailure('error', {
      to,
      from,
      error: result,
      message: '[Router] Navigation failed due to guard error.',
    });
  }

  /**
   * 清空所有守卫和状态
   */
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
