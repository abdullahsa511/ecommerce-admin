import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const mediaProxyTarget =
        env.VITE_MEDIA_PROXY_TARGET || env.VITE_WEB_BASE_URL || 'http://localhost:8089';

    const mediaProxy = {
        '/media': {
            target: mediaProxyTarget,
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path
        }
    };

    return {
    optimizeDeps: {
        noDiscovery: true,
        include: ['quill', 'lodash', 'moment']
    },
    plugins: [
        vue({
            script: {
                defineModel: true,
                propsDestructure: true
            }
        }),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    server: {
        allowedHosts: ['production.krost.com.au', 'krost.com.au', 'localhost', 'admin.krost.com.au', 'krost.business'],
        // Dev only — npm run build does not include a proxy; use mediaUrl() in app code for production.
        proxy: mediaProxy
    },
    preview: {
        // Same proxy when testing the production build locally via npm run preview
        proxy: mediaProxy
    }
    };
});
