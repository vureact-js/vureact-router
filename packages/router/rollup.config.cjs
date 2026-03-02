import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';

const banner = `/**
 * @vureact/router v1.0.0-beta
 * (c) 2025-present Ruihong Zhong (Ryan John)
 * @license MIT
 */
`;

const entries = {
  'vureact-router': 'src/index.ts',
};

const outputItem = (type = 'js', format = 'cjs') => ({
  dir: `dist/${type === 'js' ? 'cjs' : 'esm'}`,
  format,
  entryFileNames: `[name].${type}`, // 保持分包目录结构
  chunkFileNames: `chunks/[name]-[hash].${type}`, // 公共代码提取到 chunks 目录
  sourcemap: true,
  banner,
});

const externalPkgs = ['react', 'react-dom', 'react-router-dom'];

const external = (id) => externalPkgs.some((pkg) => id === pkg || id.startsWith(pkg + '/'));

export default [
  {
    input: entries,

    output: [outputItem(), outputItem('esm.js', 'es')],

    external,

    treeshake: {
      preset: 'recommended',
      moduleSideEffects: true,
    },

    plugins: [
      resolve({}),

      commonjs(),

      alias({
        entries: {
          '@src': './src',
        },
        resolve: ['.ts', '.tsx'],
      }),

      typescript({
        tsconfig: './tsconfig-rollup.json',
        declaration: false,
      }),

      terser({
        compress: {
          drop_console: false,
          pure_funcs: [
            'console.log',
            'console.warn',
            'console.info',
            'console.debug',
            'console.trace',
          ],
          passes: 2,
          booleans: true,
          conditionals: true,
          dead_code: true,
          unused: true,
          join_vars: true,
          sequences: true,
          reduce_funcs: true,
          comparisons: true,
        },
        format: {
          beautify: false,
          comments: (_, comment) => {
            const text = comment.value;
            return /@vureact\/router/i.test(text);
          },
        },
      }),

      visualizer({
        filename: './bundles-size.html',
        open: false,
      }),
    ],
  },

  ...Object.keys(entries).map((name) => ({
    input: entries[name],
    output: {
      file: `dist/types/${name}.d.ts`,
      format: 'es',
    },
    plugins: [dts()],
    external,
  })),
];
