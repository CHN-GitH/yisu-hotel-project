const path = require('path');

// 业务配置
const ENV = process.env.NODE_ENV || 'development';
const businessConfig = {
  development: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 10000,
    mock: true
  },
  production: {
    baseUrl: 'https://api.easyhotel.com/api',
    timeout: 10000,
    mock: false
  }
};

// Taro 编译配置
const config = {
  projectName: 'easyhotel',
  date: '2026-02-18',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack5',
  
  defineConstants: {
    ENV_CONFIG: JSON.stringify(businessConfig[ENV])
  },
  
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    '@utils': path.resolve(__dirname, '..', 'src/utils')
  },
  
  plugins: [],
  
  mini: {
    postcss: {
      autoprefixer: { enable: true },
      url: {
        enable: true,
        config: { limit: 10240 }
      }
    }
  },
  
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['nutui-react', '@nutui/nutui-react']
  }
};

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};