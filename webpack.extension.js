const fs = require('fs/promises');
const packageInfo = require('./package.json');
const dateFns = require('date-fns');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const { webpackCommonConfig } = require('./webpack.common.js');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

class CreateFilePlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.afterEmit.tap(this.constructor.name, async (compilation) => {
      const buildPath = compilation.options.output.path;
      const version = packageInfo.version;
      const buildDate = dateFns.format(new Date(), 'yymmdd-hhmmss');
      const text = `version: ${version} ${buildDate}`;

      fs.writeFile(`${buildPath}/version.txt`, text, 'utf8').catch((err) => {
        console.error(err);
      });
    });
  }
}

module.exports = merge(webpackCommonConfig, {
  mode: 'production',
  output: {
    path: path.resolve('dist/'),
    filename: 'app.[chunkhash].js',
    // 확장 프로그램은 상대 경로 사용
    publicPath: './',
    clean: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BUILD_TARGET': JSON.stringify('extension'),
    }),
    new CreateFilePlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
        },
      ],
    }),
  ],
});
