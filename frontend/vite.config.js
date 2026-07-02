import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

function requiredEnv(env, key) {
  const value = env[key]?.trim();

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyPath = requiredEnv(env, "VITE_API_PROXY_PATH").replace(/\/$/, "");
  const backendApiUrl = requiredEnv(env, "BACKEND_API_URL").replace(/\/$/, "");
  const apiProxyPathPattern = new RegExp(`^${escapeRegExp(apiProxyPath)}`);

  return {
    plugins: [react()],
    server: {
      proxy: {
        [apiProxyPath]: {
          target: backendApiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(apiProxyPathPattern, ""),
        },
      },
    },
  };
});
