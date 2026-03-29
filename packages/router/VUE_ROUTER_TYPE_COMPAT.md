# Vue Router Type Compatibility

This document describes the type-level compatibility layer provided by `@vureact/router`.

## Import Entries

- Root entry: `@vureact/router`
- Compat sub-entry: `@vureact/router/type-compat`

Use the root entry for non-conflicting aliases.  
Use the compat sub-entry when you need Vue Router naming for symbols that conflict with existing `@vureact/router` names.

## 1) Fully Compatible Aliases (Root Entry)

These aliases are exported from `@vureact/router`:

| Vue Router Name                 | `@vureact/router` Alias             |
| ------------------------------- | ----------------------------------- |
| `RouteLocationRaw`              | `string \| RouterOptions`           |
| `RouteLocationNormalized`       | `RouteLocation`                     |
| `RouteLocationNormalizedLoaded` | `RouteLocation`                     |
| `RouteLocationResolved`         | `RouteLocation`                     |
| `NavigationGuard`               | `GuardWithNextFn \| NonNextFnGuard` |
| `NavigationGuardNext`           | `Parameters<GuardWithNextFn>[2]`    |
| `NavigationHookAfter`           | `AfterEachGuard`                    |
| `RouteMeta`                     | `Record<string, any>`               |
| `LocationQueryRaw`              | `Record<string, any>`               |
| `RouteRecordName`               | `string`                            |

## 2) Conflict Name Compatibility (Compat Sub-entry)

These aliases are exported from `@vureact/router/type-compat`:

| Vue Router Name | Compat Alias Target   |
| --------------- | --------------------- |
| `Router`        | `RouterInstance`      |
| `RouterOptions` | `CreateRouterOptions` |

The compat sub-entry also re-exports the root aliases above.

## 3) Approximate Mapping (Type-only)

`NavigationFailureType` in compat sub-entry is:

```ts
type NavigationFailureType = 'aborted' | 'redirected' | 'cancelled' | 'error' | 'duplicated';
```

Notes:

- `duplicated` is added for migration compatibility.
- This is type-level compatibility only.
- Runtime behavior does not guarantee emitting `duplicated`.

## 4) Not Covered in This Layer

Some advanced Vue Router generic normalization types are not force-mapped in this release.  
If needed, prefer local adapter types in your app instead of unsafe global aliases.
