const path = require('path');
const htmlWebpackPlugin = require('./webpack.htmlwebpackplugin');
//将css提取为独立文件
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { entry, htmlWebpackPlugins } = htmlWebpackPlugin();
//项目根目录
const projectRoot = process.cwd();
module.exports = {
    entry: entry,
    output:{
        path: path.resolve(projectRoot, 'dist'),
        filename: ({ chunk }) => {
            //获取模块路径
            var moduleName = chunk.entryModule.context.split('view\\');
            //返回文件路径
            return 'js/' + moduleName[1] + '/' + chunk.name + '.js';
        },
        publicPath: '../../',
    },
    module:{
        rules: [
            //解析js
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ]
            },
            //解析css
            {
                test: /\.css$/,
                use: [
                    miniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75
                        }
                    }
                ]
            },
            //解析stylus
            {
                test: /\.styl$/,
                use: [
                    {
                        loader:  miniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75
                        }
                    },
                    'stylus-loader',
                    
                ]
            },
            //解析图片
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: '../../images/',
                            outputPath: './images/',
                            esModules: false
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        //清理输出目录
        new CleanWebpackPlugin(),
        //将css提取为独立文件
        new miniCssExtractPlugin({
            moduleFilename: ({ name, entryModule }) => {
                var moduleName = entryModule.context.split("view\\");
                return 'css/' + moduleName[1] + '/' + name + '.css';
            },
        }),
        ...htmlWebpackPlugins,
    ]
}