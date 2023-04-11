import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
// import { visualizer } from "rollup-plugin-visualizer";
// @ts-ignore
import packageJson from './package.json';

const fileMapping = {
  'index': 'pricing-cards',
};

function customFileName(assetInfo) {
  const originalName = assetInfo.name.split('.')[0];
  const mappedName = fileMapping[originalName];
  return mappedName ? `assets/v${packageJson.version}/${mappedName}.js` : `${originalName}-[hash][extname]`;
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: customFileName,
      },
    },
  },
  plugins: [
    react(),
    // visualizer({
    //   template: "treemap", // or sunburst
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    //   filename: "bundle-analysis.html",
    // }) as PluginOption,
  ],
})
