import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

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
  plugins: [vue()],
});
