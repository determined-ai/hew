import { defineConfig } from 'cypress';
import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/plugins';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
  },
  env: {
    pluginVisualRegressionMaxDiffThreshold: 0.0001,
    pluginVisualRegressionCleanupUnusedImages: true,
  },
  viewportHeight: 768,
  viewportWidth: 1024,
});
