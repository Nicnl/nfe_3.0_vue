import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
    plugins: [
        vue(),
        legacy({
            targets: [
                'ie 11',
            ],
        }),
    ],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, 'src')
            }
        ]
    },
    server: {
        port: 8080,
    },
    build: {
        // minify: false,
        // manifest: false,
        // sourcemap: false,
        // rollupOptions: {
        // },

        // brotliSize: false,

        rollupOptions: {
            // plugins: [visualizer({
            //     open: true,
            // })],
            // output: {
            //     indent: true,
            // },
        },

        // https://vitejs.dev/config/#build-polyfilldynamicimport
        // "When using @vitejs/plugin-legacy, the plugin sets this option to true automatically."
        //polyfillDynamicImport: false,
    },
    css: {
        preprocessorOptions: {
            scss: {
                /*
                additionalData: `
                    @import '@/resources/style/theming/mixins';
                    @import '@/resources/style/theming/theme';`
                //*/
            },
        },
    },
})
