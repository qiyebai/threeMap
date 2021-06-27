const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  productionSourceMap: false,
  outputDir: 'web',
  publicPath: '',
  chainWebpack: (config) => {
    config.resolve.symlinks(true); // 修复热更新失效
    //
    config.resolveLoader.alias.set('my-loader', './myLoader.js');
    const oneOfsMap = config.module.rule('less').oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: './src/theme/theme.less',
        })
        .end();
    });
    //
    config.module // 将xml-loader替换成raw-loader
      .rule('raw-loader')
      .test(/.(bpmn|xml)$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
    //
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        languages: ['json', 'mysql', 'html', 'css', 'less', 'scss', 'markdown'],
        features: ['coreCommands', 'bracketMatching', 'folding'],
        // features: ['accessibilityHelp', 'bracketMatching', 'caretOperations', 'clipboard', 'codeAction', 'codelens', 'colorDetector', 'comment', 'contextmenu', 'coreCommands', 'cursorUndo', 'dnd', 'find', 'folding', 'fontZoom', 'format', 'gotoError', 'gotoLine', 'gotoSymbol', 'hover', 'iPadShowKeyboard', 'inPlaceReplace', 'inspectTokens', 'linesOperations', 'links', 'multicursor', 'parameterHints', 'quickCommand', 'quickOutline', 'referenceSearch', 'rename', 'smartSelect', 'snippets', 'suggest', 'toggleHighContrast', 'toggleTabFocusMode', 'transpose', 'wordHighlighter', 'wordOperations', 'wordPartOperations'],
      },
    ]);
  },
  configureWebpack: {
    resolve: {
      alias: {},
    },
    devtool: process.env.NODE_ENV === 'dev' ? 'source-map' : 'cheap-eval-source-map',
    // config.devtool = 'source-map';
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: 'moling',
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
      jsonpFunction: 'webpackJsonp_moling',
    },
  },
  devServer: {
    disableHostCheck: true,
    port: 8787,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
  },
};
