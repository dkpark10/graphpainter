const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { webpackCommonConfig } = require('./webpack.common.js');
const packageInfo = require('./package.json');

module.exports = (env) => {
  const isExtension = env?.extension;
  const buildTarget = isExtension ? 'extension' : 'web';
  const entry = isExtension ? './src/app/extension/index.tsx' : './src/app/web/index.tsx';

  return merge(webpackCommonConfig, {
    entry,
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      open: true,
      port: 3000,
      hot: true, // 모듈 전체를 다시 로드하지 않고 변경사항만 확인하여 로드
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.APP_VERSION': JSON.stringify(packageInfo.version),
        'process.env.BUILD_TARGET': JSON.stringify(buildTarget),
      }),
    ],
  });
};
