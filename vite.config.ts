import crypto from 'crypto';
import path from 'path';

import react from '@vitejs/plugin-react-swc';
import fastGlob from 'fast-glob';
import MagicString from 'magic-string';
import type { Plugin } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import p from './package.json';
import { svgToReact } from 'vite-plugin-svg-to-jsx';

const deps = Object.keys(p.dependencies).flatMap((d) => [d, new RegExp(`^${d}/*`)]);

// adapted from https://github.com/emosheeep/fe-tools/blob/master/packages/vite-plugin-lib-inject-css
const cssInsertionPlugin = (): Plugin => ({
  config() {
    return {
      build: {
        // force codesplit on
        cssCodeSplit: true,
        // force ssr builds to emit assets
        ssrEmitAssets: true,
      },
    };
  },
  enforce: 'post',
  name: 'css-insertion',
  renderChunk(code, chunk) {
    if (!chunk.viteMetadata?.importedCss.size) {
      return;
    }
    const { importedCss } = chunk.viteMetadata;
    const ms = new MagicString(code);
    for (const fileName of importedCss) {
      let filePath = path.relative(path.dirname(chunk.fileName), fileName);
      filePath = filePath.startsWith('.') ? filePath : `./${filePath}`;
      const importStatement = `import '${filePath}'\n`;
      if (/^['"]use strict['"];/.test(code)) {
        ms.appendRight(14, importStatement);
      } else {
        ms.prepend(importStatement);
      }
    }
    return {
      code: ms.toString(),
      map: ms.generateMap(),
    };
  },
});
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  build: {
    assetsDir: '',
    commonjsOptions: {
      include: [/node_modules/, /notebook/],
    },
    cssCodeSplit: true,
    lib: process.env.BUILD_PREVIEW
      ? undefined
      : {
          entry: fastGlob
            .sync('./src/kit/**/*.ts?(x)', {
              ignore: ['./**/__mocks__/**/*', './**/*.test.*'],
            })
            .reduce(
              (memo, filePath) => {
                const moduleName = path
                  .relative('./src', filePath)
                  .slice(0, -path.extname(filePath).length);
                memo[moduleName] = filePath;
                return memo;
              },
              { index: './src/index.ts' } as Record<string, string>,
            ),
        },
    minify: false,
    outDir: 'build',
    rollupOptions: process.env.BUILD_PREVIEW
      ? undefined
      : {
          external: deps,
          output: [
            {
              dir: './build/es',
              format: 'es',
              hoistTransitiveImports: false,
            },
            {
              dir: './build/cjs',
              format: 'cjs',
              hoistTransitiveImports: false,
            },
          ],
        },
  },
  css: {
    modules: {
      generateScopedName: (name, filename) => {
        const basename = path.basename(filename).split('.')[0];
        const hashable = `${basename}_${name}`;
        const hash = crypto.createHash('sha256').update(filename).digest('hex').substring(0, 5);

        return `${hashable}_${hash}`;
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    svgToReact({
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              convertColors: {
                currentColor: '#000',
              },
              removeViewBox: false,
            },
          },
        },
      ],
    }),
    react(),
    !process.env.BUILD_PREVIEW && cssInsertionPlugin(),
    mode !== 'test' &&
      checker({
        typescript: {
          buildMode: command === 'build',
          tsconfigPath: command === 'serve' ? './tsconfig.check.json' : './tsconfig.json',
        },
      }),
  ],
  test: {
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
}));
