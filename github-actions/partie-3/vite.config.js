import { defineConfig } from "vite";
import vituum from "vituum";
import eslint from "vite-plugin-eslint";

// Note: Vituum auto-serves files under ./src. Keep routes simple and link directly to administration.html

export default defineConfig({
    base: "./",
    plugins: [
        vituum({
            pages: {
                dir: "./src",
                root: "./",
                normalizeBasePath: true
            },
        }),
        eslint({
            include: "./src/**/*.js",
            failOnError: false,
        }),
    ],
    server: {
        // Expose the server to the network allowing access from ip address
        host: true,
        open: true,
        middlewareMode: false,
        proxy: {
            '/api/tyradex': {
                target: 'https://tyradex.app',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/tyradex/, ''),
            },
            '/api/github': {
                target: 'https://api.github.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/github/, ''),
            },
            '/api/tcgdex': {
                target: 'https://api.tcgdex.net',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/tcgdex/, ''),
            },
        },
    },
    build: {
        // Production build configuration can be customized here if needed.
    },
    test: {
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/cypress/**",
            "**/worklets/**",
            "**/.{idea,git,cache,output,temp}/**",
            "**/e2e/**",
        ],
        environment: 'happy-dom',
        css: false,
    },
});
