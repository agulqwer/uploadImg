// 连接数组并合并对象
const merge = require('webpack-merge');
// 引入webpack
const webpack = require('webpack');
// 将css单独打包成文件
const miniCssExtractPlugin = require('mini-css-extract-plugin');
// 清理构建文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 引入node的文件处理模块
const path = require('path');
// 速度分析插件
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// 初始化速度分析插件
// const smp = new SpeedMeasurePlugin();
// 引入生产环境配置文件
const TerserPlugin = require('terser-webpack-plugin');
const productionConfig = require('./webpack.config.build.js');
// 引入开发环境配置文件
const developmentConfig = require('./webpack.config.dev.js');
// 引入loader配置文件
const webpackLoader = require('./webpack.loader.config.js');
// 引入dll配置文件
const { dllPlugins } = require('./webpack.config.dll.js');
// 引入htmlwebpackplugin配置 处理并生成html文件
const HtmlWebpackPlugin = require('./webpack.htmlwebpackplugin.js');

// 获取入口文件和htmlwebpackplugin插件配置
const { entry, htmlWebpackPlugins } = HtmlWebpackPlugin();
// 获取项目根目录
const projectRoot = process.cwd();
// 自定义plugins数组
const customPlugins = [];
/**
 * 根据不同的环境生成不同的配置文件
 * @param {String} env  "production" or "development"
 */
const generateConfig = (env) => ({
  entry,
  output: {
    // 构建文件的输出目录
    path: path.join(projectRoot, './dist'),
    // 文件名
    filename: ({ chunk }) => {
      // 获取模块路径
      let entryModule;
      if (env === 'production') {
        entryModule = chunk.entryModule;
      } else {
        entryModule = chunk.entryModule.dependencies[2].module;
      }
      const moduleName = entryModule.context.split('js\\');
      // 获取文件名
      const pageName = chunk.name.replace(moduleName[1], '');
      // 返回文件名
      if (env === 'production') {
        return `public/js/${moduleName[1]}/${pageName}-[chunkhash:5].js`;
      }
      return `public/js/${moduleName[1]}/${pageName}.js`;
    },
    // 分离块的文件名
    chunkFilename: env === 'production' ? 'public/js/[name]-[chunkhash:5].js' : 'public/js/[name].js',
    publicPath: '/',
  },
  module: {
    // 不去解析jquery模块
    // noParse: /jquery/,
    rules: [
      // 解析js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [path.join(projectRoot, 'src/js'), path.join(projectRoot, 'src/lib')],
        use: webpackLoader.scriptLoader,
      },
      // 解析css
      // {
      //   test: /\.css$/,
      //   use: webpackLoader.cssLoader(env, miniCssExtractPlugin),
      // },
      // 解析stylus
      {
        test: /\.styl$/,
        // exclude: path.join(projectRoot, 'node_modules'),
        include: path.join(projectRoot, 'src/stylus'),
        use: webpackLoader.stylusLoader(env, miniCssExtractPlugin),
      },
      // 解析图片
      {
        test: /\.(png|jpe?g|gif)$/,
        include: path.join(projectRoot, 'src/images'),
        use: webpackLoader.imageLoader,
      },
      // 解析html
      {
        test: /\.html$/,
        include: path.join(projectRoot, 'src/view'),
        use: webpackLoader.htmlLoader,
      },

    ],
  },
  plugins: [
    // 清理构建目录
    new CleanWebpackPlugin({
      // 在构建前需要清理的目录
      cleanOnceBeforeBuildPatterns: ['app', 'public'],
    }),
    ...htmlWebpackPlugins,
    // dll配置
    ...dllPlugins,
    // 自动加载模块
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
    }),
  ].concat(customPlugins),
  // 优化
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
      }),
    ],
  },
});

module.exports = (() => {
  const config = (process.env.NODE_ENV === 'production') ? productionConfig : developmentConfig;
  if (process.env.PARAM === 'analyzer') {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    customPlugins.push(
      new BundleAnalyzerPlugin(),
    );
  }
  return merge(generateConfig(process.env.NODE_ENV), config);
});
