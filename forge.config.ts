// forge.config.ts
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { VitePlugin } from '@electron-forge/plugin-vite';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'LAN Scanner',
    icon: './assets/icon',
    appBundleId: 'com.lanscanner.app',
  },
  rebuildConfig: {},
  makers: [new MakerDMG({
    icon: './assets/icon.icns',
  })],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds
      build: [
        {
          // Main process entry point
          entry: 'src/main/index.ts',
          config: 'vite.main.config.ts',
        },
        {
          // Preload scripts entry point
          entry: 'src/main/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      // Renderer process
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
};

export default config;
