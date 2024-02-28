import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/plugins';
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      bundler: 'vite',
      framework: 'react',
    },
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
  },
  env: {
    pluginVisualRegressionCleanupUnusedImages: true,
    pluginVisualRegressionMaxDiffThreshold: 0.0001,
  },
  viewportHeight: 600,
  viewportWidth: 800,
});
