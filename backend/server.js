// backend/server.js - 易宿酒店预订平台Mock服务器

// 引入依赖
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 创建Express应用
const app = express();
const PORT = 3000;  // 服务器运行在3000端口

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const HOTELS_FILE = path.join(DATA_DIR, 'hotels.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 从文件加载数据
function loadDataFromFile(filePath, defaultData) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`加载数据文件失败: ${filePath}`, error);
  }
  return defaultData;
}

// 保存数据到文件
function saveDataToFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`保存数据文件失败: ${filePath}`, error);
  }
}

// 中间件：允许所有前端跨域请求
app.use(cors());

// 中间件：解析JSON请求体（前端POST数据用）
app.use(express.json());

// ========== Mock数据 ==========

// 默认用户数据（商户+管理员）
const defaultUsers = [
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

// 默认酒店数据
const defaultHotels = [
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

// 从文件加载数据，如果没有则使用默认数据
let mockUsers = loadDataFromFile(USERS_FILE, defaultUsers);
let mockHotels = loadDataFromFile(HOTELS_FILE, defaultHotels);

// ========== 中间件 ==========

// 模拟解析 token，获取用户信息
function getUserFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // 移除 "Bearer " 前缀
  // 从 token 中解析用户 ID（格式：mock-token-{id}）
  const match = token.match(/mock-token-(\d+)/);
  if (!match) {
    return null;
  }

  const userId = parseInt(match[1]);
  return mockUsers.find(u => u.id === userId);
}

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
    // 返回业务错误，不使用 401 状态码
    res.json({
      code: 1,
      msg: "用户名或密码错误"
    });
  }
});

// 获取酒店列表 GET /api/hotel/list
app.get('/api/hotel/list', (req, res) => {
  console.log('[获取酒店列表]', req.query);  // 打印查询参数

  // 获取当前登录用户
  const currentUser = getUserFromToken(req);

  // 从URL获取查询参数：?star=5&status=online
  const { star, status } = req.query;

  // 转换数据字段名
  const transformHotel = (hotel) => ({
    ...hotel,
    nameCn: hotel.name,
    star: hotel.starLevel,
    minPrice: hotel.price,
    status: hotel.status === 'published' ? 'online' :
      hotel.status === 'under_review' ? 'pending' : hotel.status,
    rejectReason: hotel.rejectReason,
    pendingAction: hotel.pendingAction
  });

  let filteredHotels = mockHotels;

  // 根据用户角色过滤数据
  if (currentUser && currentUser.role === 'merchant') {
    // 商户只能看到自己的酒店
    filteredHotels = filteredHotels.filter(h => h.merchantId === currentUser.id);
  }
  // 管理员可以看到所有酒店

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
        hotel.status === 'under_review' ? 'pending' : hotel.status,
      rejectReason: hotel.rejectReason,
      pendingAction: hotel.pendingAction
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

  // 保存到文件
  saveDataToFile(USERS_FILE, mockUsers);

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

  // 保存到文件
  saveDataToFile(HOTELS_FILE, mockHotels);

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
    const hotel = mockHotels[hotelIndex];

    // 保存新数据，等待审核
    const newData = {
      name: nameCn || hotel.name,
      nameEn: nameEn !== undefined ? nameEn : hotel.nameEn,
      address: address || hotel.address,
      starLevel: star || hotel.starLevel,
      price: minPrice || hotel.price,
      openDate: openDate || hotel.openDate,
      facilities: facilities !== undefined ? facilities : hotel.facilities,
      discountsInfo: discountInfo !== undefined ? discountInfo : hotel.discountsInfo
    };

    // 保存原始状态和待审核数据
    hotel.originalStatus = hotel.status;
    hotel.pendingData = newData;
    hotel.pendingAction = 'update';
    hotel.status = 'under_review';

    // 保存到文件
    saveDataToFile(HOTELS_FILE, mockHotels);

    res.json({
      code: 0,
      msg: "已提交审核，请等待管理员审核",
      data: {
        ...hotel,
        nameCn: hotel.name,
        star: hotel.starLevel,
        minPrice: hotel.price
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
    // 商户发布需要管理员审核
    mockHotels[hotelIndex].originalStatus = mockHotels[hotelIndex].status;
    mockHotels[hotelIndex].status = "under_review";
    mockHotels[hotelIndex].pendingAction = "publish";

    // 保存到文件
    saveDataToFile(HOTELS_FILE, mockHotels);

    res.json({
      code: 0,
      msg: "已提交审核，请等待管理员审核",
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
    // 商户下线需要管理员审核
    mockHotels[hotelIndex].originalStatus = mockHotels[hotelIndex].status;
    mockHotels[hotelIndex].status = "under_review";
    mockHotels[hotelIndex].pendingAction = "offline";

    // 保存到文件
    saveDataToFile(HOTELS_FILE, mockHotels);

    res.json({
      code: 0,
      msg: "已提交审核，请等待管理员审核",
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

    // 保存到文件
    saveDataToFile(HOTELS_FILE, mockHotels);

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
    const hotel = mockHotels[hotelIndex];
    const pendingAction = hotel.pendingAction;

    if (status === 'approved') {
      // 审核通过，执行待处理的操作
      if (pendingAction === 'publish') {
        hotel.status = 'published';
      } else if (pendingAction === 'offline') {
        hotel.status = 'offline';
      } else if (pendingAction === 'update') {
        // 应用待更新的数据
        if (hotel.pendingData) {
          Object.assign(hotel, hotel.pendingData);
        }
        hotel.status = hotel.originalStatus || 'published';
      } else {
        hotel.status = 'published';
      }
      delete hotel.pendingAction;
      delete hotel.pendingData;
      delete hotel.originalStatus;
      delete hotel.rejectReason;
    } else if (status === 'rejected') {
      // 审核拒绝，恢复原状态
      if (hotel.originalStatus) {
        hotel.status = hotel.originalStatus;
      } else {
        hotel.status = 'offline';
      }
      hotel.rejectReason = reason;
      delete hotel.pendingAction;
      delete hotel.pendingData;
      delete hotel.originalStatus;
    }

    // 保存到文件
    saveDataToFile(HOTELS_FILE, mockHotels);

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
