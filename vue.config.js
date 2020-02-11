module.exports = {
    devServer: {
      open: true,
      host: '0.0.0.0',
      port: 8081,
      https: false,
      hotOnly: false,
      // proxy: {
      //   // 配置跨域
      //   '/api': {
      //     target: 'https://ele-interface.herokuapp.com/api/',
      //     ws: true,
      //     changOrigin: true,
      //     pathRewrite: {
      //       '^/api': ''
      //     }
      //   }
      // }
      before: app => {}
    }
  };
  