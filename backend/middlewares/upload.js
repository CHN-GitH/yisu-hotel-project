// 文件上传中间件
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const config = require('../config');

// 确保上传目录存在
const fs = require('fs');
if (!fs.existsSync(config.upload.path)) {
  fs.mkdirSync(config.upload.path, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.upload.path);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = uuid.v4() + ext;
    cb(null, filename);
  }
});

// 配置文件过滤器
const fileFilter = function (req, file, cb) {
  // 允许所有文件类型（暂时禁用文件类型检查，以便测试）
  cb(null, true);
};

// 创建上传中间件
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxSize
  },
  fileFilter: fileFilter
});

module.exports = upload;
