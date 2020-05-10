const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
//读取路径配置文件
const { buildConfig } = require('./build.js');
// 获取项目根目录
const projectRoot = process.cwd();
// 自动引入dll中的文件
const files = fs.readdirSync(path.resolve(projectRoot, 'dll'));
const dllPlugins = [];
// 遍历文件
files.forEach((file) => {
  // 正则匹配文件
  if (/.*\.dll\.js/.test(file)) {
    dllPlugins.push(
      new AddAssetHtmlWebpackPlugin({
        filepath: path.resolve(projectRoot, 'dll', file),
        outputPath: `${buildConfig.publicPath}/dll`,
        publicPath: `/${buildConfig.publicPath}/dll`,
      }),
    );
  }

  if (/.*\.manifest\.json/.test(file)) {
    dllPlugins.push(
      new webpack.DllReferencePlugin({
        manifest: path.resolve(projectRoot, 'dll', file),
      }),
    );
  }
});

module.exports = {
  dllPlugins,
};
