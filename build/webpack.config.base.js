//引入webpack
const webpack = require('webpack');
const fs = require("fs");
//连接数组并合并对象
const merge = require('webpack-merge');
//将css单独打包成文件
const miniCssExtractPlugin = require('mini-css-extract-plugin');
//清理构建文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//引入node的文件处理模块
const path = require('path');

//引入生产环境配置文件
const productionConfig = require('./webpack.config.build.js');
//引入开发环境配置文件
const developmentConfig = require('./webpack.config.dev.js');
//引入loader配置文件
const webpackLoader = require('./webpack.loader.config.js');
//引入htmlwebpackplugin配置 处理并生成html文件
const htmlWebpackPlugin = require('./webpack.htmlwebpackplugin.js');
//速度分析插件
const speedMeasurePlugin = require('speed-measure-webpack-plugin');
//初始化速度分析插件
const smp = new speedMeasurePlugin();

//获取入口文件和htmlwebpackplugin插件配置
const { entry, htmlWebpackPlugins } = htmlWebpackPlugin();
//获取项目根目录
const project = process.cwd();
/**
 * 根据不同的环境生成不同的配置文件
 * @param {String} env  "production" or "development"
 */
const generateConfig = (env) => {
    return {
        entry: entry,
        output: {
            //构建文件的输出目录
            path: path.join(project, './dist'),
            //文件名
            filename: ({ chunk }) => {
                //获取模块路径
                if(env === 'production') {
                    var entryModule = chunk.entryModule;
                }else {
                    var entryModule = chunk.entryModule.dependencies[2].module;
                }
                const moduleName = entryModule.context.split('js\\');
                //获取文件名
                const pageName = chunk.name.replace(moduleName[1], '');
                //返回文件名
                if(env === "production"){
                    return 'js/' + moduleName[1] + '/' + pageName + '-[chunkhash:5].js';
                }else{
                    return 'js/' + moduleName[1] + '/' + pageName + '.js';
                }
                
            },
            //分离块的文件名
            chunkFilename: env === "production"? './js/[name]-[chunkhash:5].js' : './js/[name].js',
            publicPath: '../../'
        },
        module:{
            //不去解析jquery模块
            // noParse: /jquery/,
            rules: [
                //解析js
                {
                    test:  /\.js$/,
                    exclude: /node_modules/,
                    use: webpackLoader.scriptLoader
                },
                //解析css
                {
                    test: /\.css$/,
                    use: webpackLoader.cssLoader(env, miniCssExtractPlugin)
                },
                //解析stylus
                {
                    test: /\.styl$/,
                    include: path.join(project, 'src/stylus'),
                    use: webpackLoader.stylusLoader(env, miniCssExtractPlugin)
                },
                //解析图片
                {
                    test: /\.(png|jpe?g|gif)$/,
                    use: webpackLoader.imageLoader,
                },
                // 解析html
                {
                    test: /\.html$/,
                    use: webpackLoader.htmlLoader
                }

            ]
        },
        plugins: [
            //清理构建目录
            new CleanWebpackPlugin(),
            ...htmlWebpackPlugins,
        ]
    }
}

module.exports = smp.wrap((env) => {
    let config = (env === 'production') ?  productionConfig : developmentConfig ;
    return merge(generateConfig(env), config);
});