const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const files = fs.readdirSync(path.join(projectRoot, 'dist/public/images'));
const fileArr = [];
files.forEach((file) => {
  fileArr.push(
    path.join(projectRoot, 'dist/public/images', file),
  );
});

module.exports = {
  entry: fileArr,
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
              publicPath: '/public/images/', // 访问的相对路径
              outputPath: 'public/images',
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
