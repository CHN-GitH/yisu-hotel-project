// 用户路由
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// 获取当前用户信息
router.get('/info', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      code: 0,
      msg: '获取成功',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 更新用户信息
router.put('/info', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        code: 400,
        msg: '请填写姓名'
      });
    }

    const updatedUser = await User.update(userId, { name });
    
    res.json({
      code: 0,
      msg: '更新成功',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 修改密码
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        code: 400,
        msg: '请填写原密码和新密码'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        code: 404,
        msg: '用户不存在'
      });
    }

    // 验证原密码
    const bcrypt = require('bcrypt');
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({
        code: 400,
        msg: '原密码错误'
      });
    }

    // 更新密码
    await User.update(userId, { password: newPassword });
    
    res.json({
      code: 0,
      msg: '密码修改成功',
      data: null
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 管理员获取所有用户
router.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.getAll();
    
    // 移除密码字段
    const usersWithoutPassword = users.map(user => {
      const { password, ...userInfo } = user;
      return userInfo;
    });
    
    res.json({
      code: 0,
      msg: '获取成功',
      data: usersWithoutPassword
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 管理员创建用户
router.post('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    
    if (!username || !password || !name || !role) {
      return res.status(400).json({
        code: 400,
        msg: '请填写完整信息'
      });
    }

    const newUser = await User.create({ username, password, name, role });
    
    // 移除密码字段
    const { password: _, ...userInfo } = newUser;
    
    res.json({
      code: 0,
      msg: '创建成功',
      data: userInfo
    });
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 管理员更新用户
router.put('/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, name, role, password } = req.body;
    
    if (!username || !name || !role) {
      return res.status(400).json({
        code: 400,
        msg: '请填写完整信息'
      });
    }

    const updatedUser = await User.update(userId, { username, name, role, password });
    
    // 移除密码字段
    const { password: _, ...userInfo } = updatedUser;
    
    res.json({
      code: 0,
      msg: '更新成功',
      data: userInfo
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 管理员删除用户
router.delete('/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    await User.delete(userId);
    
    res.json({
      code: 0,
      msg: '删除成功',
      data: null
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

module.exports = router;
