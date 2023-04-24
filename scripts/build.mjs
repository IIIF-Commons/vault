import { defineConfig } from './base-config.mjs';
import { build } from 'vite';
import chalk from 'chalk';
import { execa } from "execa";

(async () => {

  const DIST = 'dist';
  const external = ['@iiif/parser'];

  // Main UMD build.
  buildMsg('UMD');
  await build(
    defineConfig({
      entry: `src/index.ts`,
      name: 'index',
      outDir: DIST,
      globalName: 'IIIFVault',
    })
  );

  buildMsg('@iiif/vault');
  await build(
    defineConfig({
      entry: `src/index.ts`,
      name: 'index',
      outDir: `${DIST}/bundle`,
      external,
    })
  );

  buildMsg('@iiif/vault (node)');
  await build(
    defineConfig({
      entry: './src/index.node.ts',
      name: 'index',
      outDir: `${DIST}/node`,
      external: [...external, 'node-fetch'],
    })
  )

  buildMsg('@iiif/vault/actions');
  await build(
    defineConfig({
      entry: './src/actions/index.ts',
      name: 'index',
      outDir: `${DIST}/actions`,
    })
  )
  buildMsg('@iiif/vault/store');
  await build(
    defineConfig({
      entry: './src/store/index.ts',
      name: 'index',
      outDir: `${DIST}/store`,
    })
  )

  buildMsg('@iiif/vault/utility');
  await build(
    defineConfig({
      entry: `src/utility/index.ts`,
      name: 'index',
      outDir: `${DIST}/utility`,
      external,
    })
  );

  buildMsg('Types');

  listItem('@iiif/vault');
  await execa('./node_modules/.bin/dts-bundle-generator', ['--no-check', `--out-file=${DIST}/index.d.ts`, './src/index.ts'])

  listItem('@iiif/vault/actions');
  await execa('./node_modules/.bin/dts-bundle-generator', ['--no-check', `--out-file=${DIST}/actions/index.d.ts`, './src/actions/index.ts'])

  listItem('@iiif/vault/store');
  await execa('./node_modules/.bin/dts-bundle-generator', ['--no-check', `--out-file=${DIST}/store/index.d.ts`, './src/store/index.ts'])

  listItem('@iiif/vault/utility');
  await execa('./node_modules/.bin/dts-bundle-generator', ['--no-check', `--out-file=${DIST}/utility/index.d.ts`, './src/utility/index.ts'])

  function buildMsg(name) {
    console.log(chalk.grey(`\n\nBuilding ${chalk.blue(name)}\n`));
  }
  function listItem(name) {
    console.log(chalk.gray(`- ${chalk.green(name)}`));
  }
})();
