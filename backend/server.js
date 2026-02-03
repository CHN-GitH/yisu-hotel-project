// backend/server.js - 易宿酒店预订平台Mock服务器

// 引入依赖
const express = require('express');
const cors = require('cors');

// 创建Express应用
const app = express();
const PORT = 3000;  // 服务器运行在3000端口

// 中间件：允许所有前端跨域请求
app.use(cors());

// 中间件：解析JSON请求体（前端POST数据用）
app.use(express.json());

// ========== Mock数据 ==========

// 用户数据（商户+管理员）
const mockUsers = [
  {
    id: 1,
    username: "merchant1",
    password: "123456",
    role: "merchant",  // 角色：merchant商户, admin管理员
    name: "孙老板"
  },
  {
    id: 2,
    username: "admin1",
    password: "123456",
    role: "admin",
    name: "陈审核员"
  }
];

// 酒店数据
const mockHotels = [
  {
    id: 1,
    name: "上海陆家嘴禧玥酒店",
    nameEn: "Lujiazui Xiyue Hotel Shanghai",
    address: "上海浦东新区陆家嘴金融中心",
    starLevel: 5,  // 星级
    facilities: ["免费停车场", "健身房", "米其林餐厅"],
    openDate: "2018-05-01",
    status: "published",  // 状态：draft草稿, under_review审核中, published已发布, offline已下线
    merchantId: 1,  // 归属哪个商户
    price: 936,
    image: "https://via.placeholder.com/750x400/1890ff/ffffff?text=禧玥酒店"
  },
  {
    id: 2,
    name: "艺龙安悦酒店（浦东大道店）",
    address: "上海浦东大道地铁站旁",
    starLevel: 4,
    facilities: ["免费早餐", "地铁站附近", "可带宠物"],
    openDate: "2020-03-15",
    status: "published",
    merchantId: 1,
    price: 199,
    image: "https://via.placeholder.com/750x400/52c41a/ffffff?text=安悦酒店"
  },
  {
    id: 3,
    name: "全季酒店（虹桥店）",
    address: "上海虹桥枢纽",
    starLevel: 3,
    facilities: ["商务中心", "免费WiFi"],
    openDate: "2019-08-20",
    status: "under_review",  // 这条在审核中，管理员能看到
    merchantId: 2,
    price: 299,
    image: "https://via.placeholder.com/750x400/fa8c16/ffffff?text=全季酒店"
  }
];

// ========== API接口 ==========

// 登录接口 POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  console.log('[登录请求]', req.body);  // 打印日志，方便调试

  const { username, password } = req.body;
  const user = mockUsers.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({
      code: 200,
      message: "登录成功",
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        token: "mock-token-" + user.id  // 模拟JWT令牌
      }
    });
  } else {
    // 401状态码：未授权
    res.status(401).json({
      code: 401,
      message: "用户名或密码错误"
    });
  }
});

// 获取酒店列表 GET /api/hotels
app.get('/api/hotels', (req, res) => {
  console.log('[获取酒店列表]', req.query);  // 打印查询参数

  // 从URL获取查询参数：?starLevel=5&status=published
  const { starLevel, status } = req.query;

  let filteredHotels = mockHotels;

  // 按星级筛选
  if (starLevel) {
    filteredHotels = filteredHotels.filter(h => h.starLevel === parseInt(starLevel));
  }

  // 按状态筛选
  if (status) {
    filteredHotels = filteredHotels.filter(h => h.status === status);
  }

  res.json({
    code: 200,
    message: "获取成功",
    data: filteredHotels
  });
});

// 获取单个酒店详情 GET /api/hotels/:id
app.get('/api/hotels/:id', (req, res) => {
  const id = parseInt(req.params.id);  // 从URL /hotels/1 获取ID
  const hotel = mockHotels.find(h => h.id === id);

  if (hotel) {
    res.json({
      code: 200,
      message: "获取成功",
      data: hotel
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "酒店不存在"
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log('✅ Mock服务器启动成功！');
  console.log(`📡 地址：http://localhost:${PORT}`);
  console.log('');
  console.log('可用接口：');
  console.log('  POST http://localhost:3001/api/auth/login');
  console.log('  GET  http://localhost:3001/api/hotels');
  console.log('  GET  http://localhost:3001/api/hotels/:id');
});
