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
      code: 0,
      msg: "登录成功",
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
      msg: "用户名或密码错误"
    });
  }
});

// 获取酒店列表 GET /api/hotel/list
app.get('/api/hotel/list', (req, res) => {
  console.log('[获取酒店列表]', req.query);  // 打印查询参数

  // 从URL获取查询参数：?star=5&status=online
  const { star, status } = req.query;

  // 转换数据字段名
  const transformHotel = (hotel) => ({
    ...hotel,
    nameCn: hotel.name,
    star: hotel.starLevel,
    minPrice: hotel.price,
    status: hotel.status === 'published' ? 'online' :
      hotel.status === 'under_review' ? 'pending' : hotel.status
  });

  let filteredHotels = mockHotels;

  // 按星级筛选
  if (star) {
    filteredHotels = filteredHotels.filter(h => h.starLevel === parseInt(star));
  }

  // 按状态筛选
  if (status) {
    const backendStatus = status === 'online' ? 'published' :
      status === 'pending' ? 'under_review' : status;
    filteredHotels = filteredHotels.filter(h => h.status === backendStatus);
  }

  res.json({
    code: 0,
    msg: "获取成功",
    data: filteredHotels.map(transformHotel)
  });
});

// 获取单个酒店详情 GET /api/hotel/detail/:id
app.get('/api/hotel/detail/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hotel = mockHotels.find(h => h.id === id);

  if (hotel) {
    // 转换数据字段名
    const transformHotel = (hotel) => ({
      ...hotel,
      nameCn: hotel.name,
      star: hotel.starLevel,
      minPrice: hotel.price,
      status: hotel.status === 'published' ? 'online' :
        hotel.status === 'under_review' ? 'pending' : hotel.status
    });

    res.json({
      code: 0,
      msg: "获取成功",
      data: transformHotel(hotel)
    });
  } else {
    res.status(404).json({
      code: 404,
      msg: "酒店不存在"
    });
  }
});

// 注册接口 POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  console.log('[注册请求]', req.body);

  const { username, password, role } = req.body;

  // 检查用户名是否已存在
  const existingUser = mockUsers.find(u => u.username === username);
  if (existingUser) {
    res.json({
      code: 1,
      msg: "用户名已存在"
    });
    return;
  }

  // 创建新用户
  const newUser = {
    id: mockUsers.length + 1,
    username,
    password,
    role,
    name: username
  };

  mockUsers.push(newUser);

  res.json({
    code: 0,
    msg: "注册成功",
    data: null
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('✅ Mock服务器启动成功！');
  console.log(`📡 地址：http://localhost:${PORT}`);
  console.log('');
  console.log('可用接口：');
  console.log('  POST http://localhost:3000/api/auth/login');
  console.log('  POST http://localhost:3000/api/auth/register');
  console.log('  GET  http://localhost:3000/api/hotel/list');
  console.log('  GET  http://localhost:3000/api/hotel/detail/:id');
  console.log('  POST http://localhost:3000/api/hotel/create');
  console.log('  PUT  http://localhost:3000/api/hotel/update/:id');
  console.log('  POST http://localhost:3000/api/hotel/publish/:id/publish');
  console.log('  POST http://localhost:3000/api/hotel/publish/:id/offline');
  console.log('  DELETE http://localhost:3000/api/hotel/delete/:id');
});

// 商户创建酒店 POST /api/hotel/create
app.post('/api/hotel/create', (req, res) => {
  console.log('[创建酒店请求]', req.body);

  const { nameCn, nameEn, address, star, minPrice, openDate, facilities, discountInfo } = req.body;

  // 模拟保存
  const newHotel = {
    id: mockHotels.length + 1,
    name: nameCn,
    nameEn: nameEn || '',
    address,
    starLevel: star,
    price: minPrice,
    openDate: openDate || '2024-01-01',
    facilities: facilities || [],
    discountsInfo: discountInfo || '',
    status: "draft", // 默认草稿状态
    merchantId: 101, // 模拟当前登录商户
    image: "https://via.placeholder.com/750x400/1890ff/ffffff?text=新酒店"
  };

  mockHotels.push(newHotel);

  res.json({
    code: 0,
    msg: "创建成功",
    data: {
      ...newHotel,
      nameCn: newHotel.name,
      star: newHotel.starLevel,
      minPrice: newHotel.price
    }
  });
});

// 更新酒店 PUT /api/hotel/update/:id
app.put('/api/hotel/update/:id', (req, res) => {
  console.log('[更新酒店请求]', req.params.id, req.body);

  const id = parseInt(req.params.id);
  const { nameCn, nameEn, address, star, minPrice, openDate, facilities, discountInfo } = req.body;

  const hotelIndex = mockHotels.findIndex(h => h.id === id);

  if (hotelIndex !== -1) {
    mockHotels[hotelIndex] = {
      ...mockHotels[hotelIndex],
      name: nameCn || mockHotels[hotelIndex].name,
      nameEn: nameEn !== undefined ? nameEn : mockHotels[hotelIndex].nameEn,
      address: address || mockHotels[hotelIndex].address,
      starLevel: star || mockHotels[hotelIndex].starLevel,
      price: minPrice || mockHotels[hotelIndex].price,
      openDate: openDate || mockHotels[hotelIndex].openDate,
      facilities: facilities !== undefined ? facilities : mockHotels[hotelIndex].facilities,
      discountsInfo: discountInfo !== undefined ? discountInfo : mockHotels[hotelIndex].discountsInfo
    };

    res.json({
      code: 0,
      msg: "更新成功",
      data: {
        ...mockHotels[hotelIndex],
        nameCn: mockHotels[hotelIndex].name,
        star: mockHotels[hotelIndex].starLevel,
        minPrice: mockHotels[hotelIndex].price
      }
    });
  } else {
    res.status(404).json({
      code: 404,
      msg: "酒店不存在"
    });
  }
});

// 发布酒店 POST /api/hotel/publish/:id/publish
app.post('/api/hotel/publish/:id/publish', (req, res) => {
  console.log('[发布酒店请求]', req.params.id);

  const id = parseInt(req.params.id);
  const hotelIndex = mockHotels.findIndex(h => h.id === id);

  if (hotelIndex !== -1) {
    mockHotels[hotelIndex].status = "published";

    res.json({
      code: 0,
      msg: "发布成功",
      data: null
    });
  } else {
    res.status(404).json({
      code: 404,
      msg: "酒店不存在"
    });
  }
});

// 下线酒店 POST /api/hotel/publish/:id/offline
app.post('/api/hotel/publish/:id/offline', (req, res) => {
  console.log('[下线酒店请求]', req.params.id);

  const id = parseInt(req.params.id);
  const hotelIndex = mockHotels.findIndex(h => h.id === id);

  if (hotelIndex !== -1) {
    mockHotels[hotelIndex].status = "offline";

    res.json({
      code: 0,
      msg: "下线成功",
      data: null
    });
  } else {
    res.status(404).json({
      code: 404,
      msg: "酒店不存在"
    });
  }
});

// 删除酒店 DELETE /api/hotel/delete/:id
app.delete('/api/hotel/delete/:id', (req, res) => {
  console.log('[删除酒店请求]', req.params.id);

  const id = parseInt(req.params.id);
  const hotelIndex = mockHotels.findIndex(h => h.id === id);

  if (hotelIndex !== -1) {
    mockHotels.splice(hotelIndex, 1);

    res.json({
      code: 0,
      msg: "删除成功",
      data: null
    });
  } else {
    res.status(404).json({
      code: 404,
      msg: "酒店不存在"
    });
  }
});

// 管理员审核酒店 PATCH /api/hotels/:id/status
app.patch('/api/hotels/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status, reason } = req.body;

  const hotelIndex = mockHotels.findIndex(h => h.id === id);

  if (hotelIndex !== -1) {
    // 将前端状态转换为后端状态
    let backendStatus = status;
    if (status === 'online') backendStatus = 'published';
    if (status === 'approved') backendStatus = 'published';
    if (status === 'pending') backendStatus = 'under_review';

    mockHotels[hotelIndex].status = backendStatus;
    if (status === 'rejected') {
      mockHotels[hotelIndex].rejectReason = reason;
    }

    res.json({
      code: 0,
      msg: "审核操作成功",
      data: null
    });
  } else {
    res.status(404).json({
      code: 404,
      msg: "酒店不存在"
    });
  }
});
