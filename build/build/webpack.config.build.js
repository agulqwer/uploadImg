// 将css单独打包成文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//读取路径配置文件
const { buildConfig } = require('./build.js');
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 去除无用css
const PurgeCssPlugin = require('purgecss-webpack-plugin');
// 引入PWA插件
const WorkboxPlugin = require('workbox-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');


const path = require('path');
const glob = require('glob');

// 获取项目根目录
const projectRoot = process.cwd();
const PATHS = {
  src: path.join(projectRoot, 'src'),
};
module.exports = {
  mode: 'production',
  // 优化选项
  optimization: {
    // 拆分模块
    splitChunks: {
      chunks: 'all',
      name: '[name]',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: ()=>{
            return 'vendors';
          },
          priority: 1,
        },
      },
    },
  },
  plugins: [
    // 分离css
    new MiniCssExtractPlugin({
      moduleFilename: ({ name, entryModule }) => {
        let a = entryModule.context.split('js\\');
        a = a[1].split('\\');
        const moduleName = a[0];
        const pageName = a[1];
        // 获取文件名
        const fileName = name.replace(moduleName+pageName, '');
        return `${buildConfig.publicPath}/${moduleName}/css/${pageName}/${fileName}-[contenthash:5].css`;
      },
      publicPath: buildConfig.relativePath
    }),
    // 压缩css
    new OptimizeCssAssetsPlugin({
      // 正则表达式，用于匹配需要优化或者压缩的资源名
      assetNameRegExp: /\.css$/g,
      // 用于压缩和优化css的处理器，默认是cssnano
      cssProcessor: require('cssnano'),
      // 传递给cssProcessor的选项
      cssProcessorOptions: {
        safe: true,
        // 对注释的处理
        discardComments: {
          removeAll: true,
        },
      },
      // 指示插件是否可以将消息打印到控制台，默认true
      canPrint: true,
    }),
    // 去除没有用到的css样式
    new PurgeCssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    // 配置 PWA
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false,
        },
        warnings: false,

      },
    }),

  ],
};
