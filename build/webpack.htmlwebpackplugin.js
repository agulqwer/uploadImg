const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  // 定义入口和htmlWebpackplugin变量
  const entry = {};
  const htmlWebpackPlugins = [];
  // 获取根目录
  const projectRoot = process.cwd();
  // 获取入口文件
  const entryFiles = glob.sync(path.resolve(projectRoot, './src/js/*/*.js'));
  // 获取入口文件模块名
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    // 通过正则获取入口名
    const match = entryFile.match(/src\/js\/(.*)\/(.*).js/);
    const moduleName = match && match[1];
    const pageName = match && match[2];
    const entryName = moduleName + pageName;
    entry[entryName] = entryFile;
    // 设置html-webpack-plugin插件配置
    return htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      // html模板所在的路径
      template: path.resolve(projectRoot, `src/view/${moduleName}/${pageName}.html`),
      // 输出html的文件名陈
      filename: `./app/view/${moduleName}/${pageName}.html`,
      // 配置多入口，对应output中多入口的name值
      chunks: [entryName],
      /*
            *true: 默认值，script标签位于html文件的body底部
            *body：script标签位于html文件的body底部(同true)
            *head：script标签位于head标签内
            *false：不插入生成的js文件，只是单纯的生成一个html文件
            */
      inject: true,
      // 压缩html文件
      minify: {
        html5: true,
        // 删除空白符和换行符
        collapseWhitespace: true,
        preserveLineBreaks: false,
        // 压缩内联css
        minifyCSS: true,
        // 压缩内联JS
        minifyJS: true,
        // 去除html中的注释
        removeComments: false,
      },
    }));
  });
  // 返回参数
  return {
    entry,
    htmlWebpackPlugins,
  };
};
