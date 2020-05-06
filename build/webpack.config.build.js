//将css单独打包成文件
const miniCssExtractPlugin = require('mini-css-extract-plugin');
//压缩css
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//去除无用css
const purgeCssPlugin = require('purgecss-webpack-plugin');

const path = require('path');
const glob = require('glob');

//获取项目根目录
const projectRoot = process.cwd();
const PATHS = {
    src: path.join(projectRoot, 'src')
}
module.exports = {
    mode: 'production',
    //优化选项
    optimization: {
        //拆分模块
        splitChunks: {
            chunks: 'all',
            name: true,
            cacheGroups:{
                jquery: {
                    test: /jquery/,
                    name: 'lib/jquery',
                    priority: 2
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'lib/vendors',
                    priority: 1
                }
            }
        }
    },
    plugins: [
        //分离css
        new miniCssExtractPlugin({
            moduleFilename: ({ name, entryModule }) => {
                var moduleName = entryModule.context.split('js\\');
                var pageName = name.replace(moduleName[1], '');
                return 'css/' + moduleName[1] + '/' + pageName + '-[contenthash:5].css'
            }
        }),
        //压缩css
        new optimizeCssAssetsPlugin({
            //正则表达式，用于匹配需要优化或者压缩的资源名
            assetNameRegExp: /\.css$/g,
            //用于压缩和优化css的处理器，默认是cssnano
            cssProcessor: require('cssnano'),
            //传递给cssProcessor的选项
            cssProcessorOptions: {
                safe: true,
                //对注释的处理
                discardComments: {
                    removeAll: true
                }
            },
            //指示插件是否可以将消息打印到控制台，默认true
            canPrint: true
        }),
         //去除没有用到的css样式
        new purgeCssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})
        }),
    ]
}