const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = (env, options) => {
  return {
    devtool: options.mode === 'production' ? 'source-map' : 'inline-source-map',
    devServer: {
      static: 'dist',
      port: 3000
    },
    output: {
      filename: '[name].[contenthash].js',
      clean: true
    },
    performance: {
      hints: false,
    },
    plugins: [
      new BundleAnalyzerPlugin({analyzerMode: "static", openAnalyzer: false}),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'assets/res',
            to: 'res'
          },
        ],
      }),
      new HTMLWebpackPlugin({
        template: 'assets/index.html',
        filename: 'index.html'
      })
    ],
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [{
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    }
  }
};
