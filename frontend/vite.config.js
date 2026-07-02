import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendApiUrl = env.BACKEND_API_URL || "http://localhost:3000/api";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: backendApiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
