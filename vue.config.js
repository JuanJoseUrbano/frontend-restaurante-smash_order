const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/smash-order/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
})
