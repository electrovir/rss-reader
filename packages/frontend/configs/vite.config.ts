import {defineConfig} from '@virmator/frontend/configs/vite.config.base.js';
import {resolve} from 'node:path';

const backendPort = process.env.VITE_BACKEND_PORT
    ? Number(process.env.VITE_BACKEND_PORT)
    : undefined;

export default defineConfig(
    {
        forGitHubPages: false,
        packageDirPath: resolve(import.meta.dirname, '..'),
    },
    (baseConfig) => {
        return {
            ...baseConfig,
            define: {
                ...baseConfig.define,
                VITE_BACKEND_PORT: JSON.stringify(backendPort),
            },
        };
    },
);
