const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  configureWebpack: {
    entry: {
      content: './src/content/index.js',
      background: './src/background/index.js',
      inject: './src/inject/index.js'
    },
    output: {
      filename: 'js/[name].js'
    },
    plugins: [
      new webpack.ProvidePlugin({
        axios: 'axios',
        Vue: 'vue'
      }),
      new MiniCssExtractPlugin({ filename: 'css/[name].css' })
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    }
  },
  filenameHashing: false
}
