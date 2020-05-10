module.exports = {
  // 脚本文件处理
  scriptLoader: [
    {
      // ES6转ES5
      loader: 'babel-loader',
      options: {
        // 开启文件缓存
        cacheDirectory: true,
      },
    },
  ],
  // css文件处理，不单独分离css文件
  cssLoader(env, miniCssExtractPlugin) {
    /**
         * @param "postcss-loader"  =>  把css解析成js可以操作的AST,调用插件来处理AST
         * @param "px2rem-loader" => px到rem的单位转换
         * @param "miniCssExtractPlugin" => 单独分离css文件
        */
    const cssLoader = [];
    // 判断环境
    if (env === 'production') {
      cssLoader.push({
        loader: miniCssExtractPlugin.loader,
      });
    } else {
      cssLoader.push('style-loader');
    }
    return cssLoader.concat('css-loader', 'postcss-loader', {
      loader: 'px2rem-loader',
      options: {
        remUnit: 75,
      },
    });
  },
  // 解析stylus文件
  stylusLoader(env, miniCssExtractPlugin) {
    /**
         * @param "miniCssExtractPlugin" => 单独分离css文件
         * @param "postcss-loader"  =>  把css解析成js可以操作的AST,调用插件来处理AST
         * @param "px2rem-loader" => px到rem的单位转换
         * @param "stylus-loader" => 处理stylus文件
        */
    const stylusLoader = [];
    if (env === 'production') {
      stylusLoader.push({
        loader: miniCssExtractPlugin.loader,
      });
    } else {
      stylusLoader.push('style-loader');
    }
    return stylusLoader.concat({
      loader: 'css-loader',
      options: {
        importLoaders: 2,
      },
    },
    {
      loader: 'px2rem-loader',
      options: {
        remUnit: 75,
      },
    },
    'postcss-loader',
    'stylus-loader');
  },
  // 解析，压缩图片
  imageLoader: [
    {
      loader: 'url-loader',
      options: {
        name: '[name].[ext]',
        publicPath: (...data)=>{
          let a = data[1].replace(data[0], '');
          a = a.replace(data[2], '');
          a = a.split("\\");
          const path = a.filter((v)=>{
            return v;
          })
          return `/public/${path[2]}/${path[1]}/${path[3]}/${data[0]}`;
        }, // 访问的相对路径
        outputPath: (...data)=>{
          let a = data[1].replace(data[0], '');
          a = a.replace(data[2], '');
          a = a.split("\\");
          const path = a.filter((v)=>{
            return v;
          });
          return `public/${path[2]}/${path[1]}/${path[3]}/${data[0]}`;
        },
        esModules: false,
        limit: 10000, // 限制10k的大小，小于10k生成base64
      },
    },
  ],
  // html文件处理
  htmlLoader: [
    {
      loader: 'html-loader',
      options: {
        attributes: {
          list: [
            {
              tag: 'img',
              attribute: 'src',
              type: 'src',
            },
          ],
        },
      },
    },
  ],

};
