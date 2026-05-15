import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), cloudflare()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    theme: {
      extend: {
        colors: {
          curamind: {
            void: '#F9F7F5', // Warm off-white background
            depth: '#FFFFFF', // Clean white for cards
            surface: '#FDFCFB', // Very subtle elevated surface
            rim: '#E8E2DE', // Soft neutral border
            purple: '#8B7FF9', // Softer purple
            teal: '#7ACCC8', // Soft mint/sage
            coral: '#FF8A8A', // Soft coral
            gold: '#FFC875', // Soft honey gold
            text: '#3D3631', // Dark brown-grey text (softer than black)
            muted: '#8C8279', // Warm secondary text
            faint: '#F2EFED', // Very subtle neutrals
          }
        },
        fontFamily: {
          sora: ['Sora', 'sans-serif'],
          sans: ['DM Sans', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});