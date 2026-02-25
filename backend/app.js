// 主应用入口文件
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

// 初始化数据库
require('./models/init');

// 创建Express应用
const app = express();

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

// 响应处理中间件
const { responseMiddleware } = require('./middlewares/response');
app.use(responseMiddleware);

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由配置
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const hotelRoutes = require('./routes/hotel');
const roomTypeRoutes = require('./routes/roomType');
const clientRoutes = require('./routes/client');

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/room-types', roomTypeRoutes);

// 用户端路由
app.use('/city', clientRoutes);
app.use('/search', clientRoutes);
app.use('/detail', clientRoutes);
app.use('/home', clientRoutes);
app.use('/hotels', clientRoutes);
app.use('/cities', clientRoutes);

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    code: 0,
    msg: '服务运行正常',
    data: {
      timestamp: new Date().toISOString(),
      service: 'yisu-hotel-backend'
    }
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    msg: '接口不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    code: 500,
    msg: '服务器内部错误'
  });
});

// 启动服务器
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`✅ 服务器启动成功！`);
  console.log(`📡 地址：http://${config.server.host}:${PORT}`);
  console.log('');
  console.log('可用接口：');
  console.log('  POST   /api/auth/login          - 登录');
  console.log('  POST   /api/auth/register       - 注册');
  console.log('  GET    /api/user/info           - 获取用户信息');
  console.log('  PUT    /api/user/info           - 更新用户信息');
  console.log('  PUT    /api/user/password       - 修改密码');
  console.log('  POST   /api/hotel/create        - 创建酒店');
  console.log('  GET    /api/hotel/list          - 获取酒店列表');
  console.log('  GET    /api/hotel/detail/:id    - 获取酒店详情');
  console.log('  PUT    /api/hotel/update/:id    - 更新酒店');
  console.log('  POST   /api/hotel/publish/:id/publish - 发布酒店');
  console.log('  POST   /api/hotel/publish/:id/offline - 下线酒店');
  console.log('  DELETE /api/hotel/delete/:id    - 删除酒店');
  console.log('  GET    /api/room-types/:hotelId - 获取房型列表');
  console.log('  POST   /api/room-types          - 创建房型');
  console.log('  PUT    /api/room-types/:id      - 更新房型');
  console.log('  DELETE /api/room-types/:id      - 删除房型');
  console.log('');
  console.log('用户端接口：');
  console.log('  GET    /city/all                - 获取所有城市');
  console.log('  GET    /cities/hot              - 获取热门城市');
  console.log('  GET    /search/result           - 搜索酒店');
  console.log('  GET    /detail/infos            - 获取酒店详情');
  console.log('  GET    /home/houselist          - 获取首页房源列表');
  console.log('  GET    /home/hotSuggests        - 获取热门推荐');
  console.log('  GET    /home/categories         - 获取首页分类');
});

module.exports = app;
