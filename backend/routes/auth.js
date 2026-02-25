// 认证路由
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken } = require('../middlewares/auth');
const bcrypt = require('bcrypt');

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        msg: '请填写用户名和密码'
      });
    }

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        code: 401,
        msg: '用户名或密码错误'
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        code: 401,
        msg: '用户名或密码错误'
      });
    }

    const token = generateToken(user);

    res.json({
      code: 0,
      msg: '登录成功',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        token: token
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    
    if (!username || !password || !name) {
      return res.status(400).json({
        code: 400,
        msg: '请填写完整信息'
      });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        msg: '用户名已存在'
      });
    }

    // 创建新用户
    const newUser = await User.create({
      username,
      password,
      name,
      role: role || 'merchant'
    });

    const token = generateToken(newUser);

    res.json({
      code: 0,
      msg: '注册成功',
      data: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        name: newUser.name,
        token: token
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

module.exports = router;
