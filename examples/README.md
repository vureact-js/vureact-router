# @vureact/router examples

The `examples` directory contains demo projects for `@vureact/router`, built with Vite + React + TypeScript.

## How to Run

```bash
cd vureact-router/examples
npm install
npm run dev
```

Hash routing mode is used by default. After opening in the browser, access the example directory page from `#/home`.

## Local Source Code Alias Description

The examples do not depend on published npm packages; instead, they directly point to the source code in the repository via aliases:

- Vite alias: `@vureact/router -> ../packages/router/src/index.ts`
- TS paths: `@vureact/router -> ../packages/router/src/index.ts`

This allows immediate joint debugging and verification of changes made to `packages/router/src` in the examples.

## Seven Core Examples

1. `01 Basic Routing`: Basic routing, nested routing, and 404 fallback.
2. `02 RouterLink`: String/object-based navigation, `query/hash`, `customRender`, `replace`.
3. `03 useRouter/useRoute`: `push/replace/back/forward/go/resolve/current` methods and route information panel.
4. `04 Global Guards`: `beforeEach`, `beforeResolve`, `afterEach`, `onError`, with display of navigation failure information.
5. `05 Component Guards`: `useBeforeRouteLeave`, `useBeforeRouteUpdate`, `useBeforeRouteEnter`.
6. `06 Dynamic Routing`: `addRoute`, `hasRoute`, `resolve`, and navigation after runtime injection.
7. `07 Doc Examples`: standalone pages mapped from documentation chapters (`examples/src/pages/doc-examples`).

## Positioning

This example project is used for API demonstration and joint debugging verification, and does not pursue a complete product-level UI.
