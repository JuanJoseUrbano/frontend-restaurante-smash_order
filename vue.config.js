const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      // Forward all /smash-order requests to the host (Traefik on port 80)
      // This avoids CORS during development by keeping same-origin for the browser
      "^/smash-order": {
        target: "http://localhost",
        changeOrigin: true,
        ws: true,
        secure: false,
        logLevel: "debug",
        onProxyReq: (proxyReq, req, res) => {
          // Remove cookies to avoid oversized header errors (431)
          proxyReq.removeHeader("cookie");
        },
      },
    },
  },
});
