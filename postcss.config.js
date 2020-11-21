/**
 *运行在nodejs中 用来处理css
 */

module.exports = {
  plugins: {
    //  已经在vuecil内部配置
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}