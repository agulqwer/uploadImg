const path = require('path');
const webpack = require('webpack');

const projectRoot = process.cwd();
// 清理构建文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(projectRoot, 'dll'),
    library: '[name]_[hash:8]',
  },
  plugins: [
    // 清理构建目录
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.join(projectRoot, 'dll', '[name].manifest.json'),
      name: '[name]_[hash:8]',
    }),
  ],
};
