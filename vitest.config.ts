import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.test.ts'],
    },
})
