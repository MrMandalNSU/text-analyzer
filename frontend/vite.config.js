import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

function normalizeBackendApiUrl(value) {
  const url = new URL(value);
  const pathname = url.pathname.replace(/\/$/, "");

  if (!pathname.endsWith("/api")) {
    url.pathname = `${pathname}/api`;
  }

  return url.toString().replace(/\/$/, "");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendApiUrl = normalizeBackendApiUrl(
    env.BACKEND_API_URL || "http://localhost:3000/api"
  );

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
