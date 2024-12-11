const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Votre backend
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Supprime /api de l'URL avant de la transmettre
      },
    },
  },
};