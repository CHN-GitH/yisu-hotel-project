// 配置文件

module.exports = {
  // 服务器配置
  server: {
    port: 3000,
    host: 'localhost'
  },
  
  // 数据库配置
  database: {
    file: './database.db'
  },
  
  // JWT配置
  jwt: {
    secret: 'yisu-hotel-secret-key',
    expiresIn: '24h'
  },
  
  // 文件上传配置
  upload: {
    path: './uploads',
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  
  // 密码加密配置
  bcrypt: {
    saltRounds: 10
  }
};
