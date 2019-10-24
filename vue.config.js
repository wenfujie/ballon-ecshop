module.exports = {
  publicPath: '',
  lintOnSave: false,
  runtimeCompiler: true,

  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/scss/_var-fn.scss";'
      }
    }
  },
  outputDir: 'server/assets',
  assetsDir: undefined,
  productionSourceMap: false,
  parallel: undefined,
  devServer: {
    // port: 8084,// 巴龙移动 开发环境端口
    // port: 8082,// 巴龙移动 会员体系test2端口
    compress: true,
    disableHostCheck: true // That solved it
  }
};
