const fs = require('fs');
const path = require('path');
const projectRoot = process.cwd();

//定义一个函数遍历目录下所有的文件
function readFileList(dir, filesList = []){
  //去读该目录
  const files = fs.readdirSync(dir);
  //遍历文件
  files.forEach((item, index) => {
      //获取完整的路径
      const fullPath = path.join(dir, item);
      //获取路径信息
      const stat = fs.statSync(fullPath);
      //判断是否为一个文件夹
      if(stat.isDirectory()){
         //这是一个文件夹，递归读取文件
         readFileList(path.join(dir, item), filesList);
      }  else {
        //这是一个文件，添加入数组
        filesList.push(fullPath);
      }
  });
  //返回文件路径数组
  return filesList;
}
var filesList = [];
readFileList(path.join(projectRoot, 'src/images'),filesList);

module.exports = {
  entry: filesList,
  output: {
    path: path.join(projectRoot)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: (...data) => {
                
                const path = data[1].replace(data[2], '');
                return path;
              },
              esModules: false,
              limit: 10000, // 限制10k的大小，小于10k生成base64
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progessive: true,
                quality: 65,
              },
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
};
