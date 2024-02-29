import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/plugins';
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      bundler: 'vite',
      framework: 'react',
    },
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          // fullPage screenshot size is 1400x1200 on non-retina screens
          // and 2800x2400 on retina screens
          launchOptions.args.push('--window-size=1400,1200');

          // force screen to be non-retina (1400x1200 size)
          launchOptions.args.push('--force-device-scale-factor=1');

          // force screen to be retina (2800x2400 size)
          // launchOptions.args.push('--force-device-scale-factor=2')
        }

        if (browser.name === 'electron') {
          // fullPage screenshot size is 1400x1200
          launchOptions.preferences.width = 1400;
          launchOptions.preferences.height = 1200;
        }

        if (browser.name === 'firefox') {
          // menubars take up height on the screen
          // so fullPage screenshot size is 1400x1126
          launchOptions.args.push('--width=1400');
          launchOptions.args.push('--height=1200');
        }

        return launchOptions;
      });
      initPlugin(on, config);
    },
  },
  env: {
    pluginVisualRegressionCleanupUnusedImages: true,
    pluginVisualRegressionMaxDiffThreshold: 0.001,
  },
  viewportHeight: 600,
  viewportWidth: 800,
});
