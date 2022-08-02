import { createRollupConfig, createTypeConfig } from 'rollup-library-template';
import replace from '@rollup/plugin-replace';
import process from 'process';

const DEV = process.argv.indexOf('--dev') === -1;

const baseConfig = {
  filesize: true,
  minify: !DEV,
  extra: {
    treeshake: true,
  },
  esbuildOptions: {
    define: {
      'process.env.NODE_ENV': DEV ? '"development"' : '"production"',
    },
  },
  postProcess: (config) => {
    config.plugins = [
      replace({
        values: {
          'process.env.NODE_ENV': DEV ? '"development"' : '"production"',
        },
        preventAssignment: false,
      }),
      ...config.plugins,
    ];

    return config;
  },
};

const external = ['@iiif/parser'];
const nodeExternal = ['node-fetch'];
const nodeCjsExternal = [
  'node:https',
  'node:buffer',
  'node:stream',
  'node:zlib',
  'node:http',
  'node:util',
  'node:url',
  'node:net',
  'node:path',
  'node:fs',
  'node:worker_threads',
];

// Roll up configs
export default [
  createTypeConfig({
    source: './.build/types/index.d.ts',
  }),
  createTypeConfig({
    source: './.build/types/actions/index.d.ts',
    dist: './dist/actions/index.d.ts',
  }),
  createTypeConfig({
    source: './.build/types/store/index.d.ts',
    dist: './dist/store/index.d.ts',
  }),
  createTypeConfig({
    source: './.build/types/utility/index.d.ts',
    dist: './dist/utility/index.d.ts',
  }),

  // UMD bundle will have everything.
  createRollupConfig({
    ...baseConfig,
    inlineDynamicImports: true,
    input: './src/index.ts',
    output: {
      name: 'IIIFVault',
      file: `dist/index.umd.js`,
      format: 'umd',
    },
    nodeResolve: {
      browser: false,
    },
  }),
  createRollupConfig({
    ...baseConfig,
    inlineDynamicImports: true,
    input: './src/index.ts',
    output: {
      name: 'IIIFVault',
      file: `dist/index.standalone.umd.js`,
      format: 'umd',
    },
    nodeResolve: {
      browser: false,
    },
  }),

  // import {} from '@iiif/vault';
  createRollupConfig({
    ...baseConfig,
    input: './src/index.ts',
    distPreset: 'esm',
    external,
  }),
  createRollupConfig({
    ...baseConfig,
    input: './src/index.ts',
    distPreset: 'cjs',
    external,
  }),
  // Node variations.
  createRollupConfig({
    ...baseConfig,
    input: './src/index.node.ts',
    distPreset: 'esm',
    node: true,
    esmExtension: true,
    external: [...external, ...nodeExternal],
  }),
  createRollupConfig({
    ...baseConfig,
    input: './src/index.node.ts',
    distPreset: 'cjs',
    node: true,
    external: [...external, ...nodeCjsExternal],
  }),

  // import {} from '@iiif/vault/actions'
  createRollupConfig({
    ...baseConfig,
    input: './src/actions/index.ts',
    dist: 'dist/actions',
    distPreset: 'esm',
    external,
  }),
  createRollupConfig({
    ...baseConfig,
    input: './src/actions/index.ts',
    dist: 'dist/actions',
    distPreset: 'cjs',
    external,
  }),

  // import {} from '@iiif/vault/actions'
  createRollupConfig({
    ...baseConfig,
    input: './src/store/index.ts',
    dist: 'dist/store',
    distPreset: 'esm',
    external,
  }),
  createRollupConfig({
    ...baseConfig,
    input: './src/store/index.ts',
    dist: 'dist/store',
    distPreset: 'cjs',
    external,
  }),

  // import {} from '@iiif/vault/actions'
  createRollupConfig({
    ...baseConfig,
    input: './src/utility/index.ts',
    dist: 'dist/utility',
    distPreset: 'esm',
    external,
  }),
  createRollupConfig({
    ...baseConfig,
    input: './src/utility/index.ts',
    dist: 'dist/utility',
    distPreset: 'cjs',
    external,
  }),
];
