import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 8000,
    proxy: {
      "/api": {
        target: "http://localhost:8008",
      },
    },
  },
  // 定义src路径别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  // 引入scss样式常量
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/assets/style/base.scss';`,
      },
    },
  },
  plugins: [vue()],
});
