const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 入口
  entry: './src/index.js',
  // 出口
  output: {
    path: resolve(__dirname, 'dist'),
    // 打包出来的文件名
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './www/index.html'
    })
  ],
  devServer: {
    // 端口号
    port: 8080,
    open: true,
    // 静态资源文件夹
    contentBase: './dist'
  },
  mode: 'development'
}