const { VueLoaderPlugin } = require('vue-loader')
const { VuetifyPlugin } = require('webpack-plugin-vuetify')

module.exports = {
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyPlugin(),
  ],
}