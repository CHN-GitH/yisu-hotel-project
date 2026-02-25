// 认证中间件
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

// 生成JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

// 验证JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
}

// 认证中间件
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 401,
        msg: '未授权，请登录'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        code: 401,
        msg: '无效的token'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        code: 401,
        msg: '用户不存在'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      msg: '认证失败'
    });
  }
}

// 管理员权限中间件
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      code: 403,
      msg: '无管理员权限'
    });
  }
  next();
}

// 商户权限中间件
function merchantMiddleware(req, res, next) {
  if (!req.user || (req.user.role !== 'merchant' && req.user.role !== 'admin')) {
    return res.status(403).json({
      code: 403,
      msg: '无商户权限'
    });
  }
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  adminMiddleware,
  merchantMiddleware
};
