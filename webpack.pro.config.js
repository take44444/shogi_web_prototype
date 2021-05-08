const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: __dirname + '/public/src',
    filename: 'shogi-bundle.js',
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
          plugins: ['@babel/plugin-syntax-jsx'],
        },
      },
    }, {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-react-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    }, {
      test: /\.(sa|sc|c)ss$/,
      exclude: /node_modules/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {url: false},
        },
        'sass-loader',
      ],
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'shogi-bundle.css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
};
