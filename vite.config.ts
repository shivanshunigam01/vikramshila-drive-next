import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    host: true, // listen on all interfaces
    port: 8080,
    strictPort: true,
    // ✅ Allow local dev hosts, plus your prod domain
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "www.vikramshilaautomobiles.com",
    ],
    // ✅ Make HMR use the same host/port the browser is on
    hmr: {
      protocol: "ws",
      host: "localhost", // or your LAN IP if you open from phone
      port: 8080,
      // If you ever serve the dev UI over HTTPS/proxy, use:
      // protocol: "wss",
      // clientPort: 443,
    },
    // If you prefer proxying the backend instead of full URLs:
    // proxy: {
    //   "/api": { target: "http://localhost:5000", changeOrigin: true },
    // },
  },
}));
