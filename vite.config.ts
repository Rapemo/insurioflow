import { defineConfig, ViteDevServer } from "vite";
import { IncomingMessage, ServerResponse } from "http";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Custom plugin to handle Permissions-Policy headers
const permissionsPolicyPlugin = () => ({
  name: 'permissions-policy',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: Function) => {
      // Set a comprehensive Permissions-Policy that disables problematic features
      res.setHeader('Permissions-Policy', 
        'camera=(), ' +
        'microphone=(), ' +
        'geolocation=()'
      );
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [react(), permissionsPolicyPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
