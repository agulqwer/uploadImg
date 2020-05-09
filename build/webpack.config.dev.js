const webpack = require('webpack');

const path = require('path');
// 获取项目根目录
const projectRoot = process.cwd();

module.exports = {
  mode: 'development',
  // 调式工具
  devtool: 'source-map',
  // 热更新配置
  devServer: {
    // 指定服务器资源的根目录
    contentBase: path.join(projectRoot, './dist'),
    publicPath: '/',
    // 指定开启服务器的端口号
    port: 8080,
    // 给配置项是指模块替换换功能，通过在不刷新整个页面的情况下通过使用新模块替换旧模块来做实时预览的
    hot: true,
    // 该属性是用来在编译出错的时候，在浏览器页面上显示错误
    overlay: true,
    // 该配置是用来应对返回404页面时定向跳转到特定页面的
    // historyApiFallback: true
    // 解决修改html页面后，浏览器不能自动刷新
    before(app, server, compiler) {
      const watchFiles = ['.html', '.pug'];
      compiler.hooks.done.tap('done', () => {
        const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);
        if (
          this.hot
                  && changedFiles.some((filePath) => watchFiles.includes(path.parse(filePath).ext))
        ) {
          server.sockWrite(server.sockets, 'content-changed');
        }
      });
    },
  },
  plugins: [
    // 当开启HMR的时候使用该插件会显示模块的相对路径，建议用于开发环境
    new webpack.NamedModulesPlugin(),
  ],
};
