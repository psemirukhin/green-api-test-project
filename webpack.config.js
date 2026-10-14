const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const REPO_NAME = 'green-api-test-project';

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[contenthash].js',
      clean: true,
      publicPath: isProduction ? `/${REPO_NAME}/` : '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
    devServer: {
      port: 3000,
      open: true,
      hot: true,
    },
  };
};
