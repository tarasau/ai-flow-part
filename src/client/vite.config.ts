import { defineConfig, loadEnv } from 'vite';
import solid from 'vite-plugin-solid';
import federation from '@originjs/vite-plugin-federation';
import * as path from 'path';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      solid(),
      federation({
        name: 'host-app',
        remotes: {
          flow: `${process.env.VITE_FLOW_URL}/assets/flow/assets/remoteEntry.js`,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@server': path.resolve(__dirname, '../server'),
        '@infrastructure': path.resolve(__dirname, 'src/common/infrastructure'),
        '@utils': path.resolve(__dirname, 'src/common/utils'),
        '@shared': path.resolve(__dirname, '../shared'),
      },
    },
    preview: {
      port: 5174,
    },
    server: {
      port: 5174,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  });
};
