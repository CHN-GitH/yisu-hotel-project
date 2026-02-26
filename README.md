# 易宿酒店预订平台

## 项目介绍

易宿酒店预订平台是一个综合性的酒店预订系统，包含前端客户端、PC端管理系统和后端API服务。该平台支持用户搜索、预订酒店，以及管理员管理酒店、房型、订单等功能。

### 主要功能

- **客户端**：酒店搜索、筛选、详情查看、预订功能
- **PC端管理系统**：酒店管理、房型管理、订单管理、用户管理等
- **后端API**：提供完整的RESTful API接口，支持前端和管理系统的所有功能

## 目录结构

```
yisu-hotel-project/
├── backend/           # 后端API服务
│   ├── config/        # 配置文件
│   ├── middlewares/   # 中间件
│   ├── models/        # 数据模型
│   ├── routes/        # 路由
│   ├── uploads/       # 上传文件
│   ├── app.js         # 应用入口
│   ├── server.js      # 服务器启动文件
│   └── package.json   # 依赖配置
├── client/            # 前端客户端（基于Taro框架）
│   ├── config/        # 配置文件
│   ├── src/           # 源代码
│   │   ├── assets/    # 静态资源
│   │   ├── components/ # 组件
│   │   ├── pages/     # 页面
│   │   ├── services/  # API服务
│   │   ├── store/     # Redux状态管理
│   │   ├── styles/    # 样式文件
│   │   └── utils/     # 工具函数
│   └── package.json   # 依赖配置
├── client-pc/         # PC端管理系统（基于React）
│   ├── public/        # 静态资源
│   ├── src/           # 源代码
│   │   ├── api/       # API服务
│   │   ├── components/ # 组件
│   │   ├── pages/     # 页面
│   │   ├── router/    # 路由
│   │   ├── store/     # Redux状态管理
│   │   └── styles/    # 样式文件
│   └── package.json   # 依赖配置
└── README.md          # 项目说明文档
```

## 技术栈

### 前端

- **客户端**：Taro框架、React、TypeScript、Redux Toolkit
- **PC端管理系统**：React、TypeScript、Redux Toolkit、React Router
- **样式**：SCSS、CSS Modules

### 后端

- **Node.js**：运行环境
- **Express**：Web框架
- **SQLite**：数据库
- **JWT**：身份验证

## 安装步骤

### 1. 克隆项目

```bash
git clone <项目地址>
cd yisu-hotel-project
```

### 2. 安装后端依赖

```bash
cd backend
npm install 或 npm install --legacy-peer-deps
```

### 3. 安装客户端依赖

```bash
cd ../client
npm install 或 npm install --legacy-peer-deps
```

### 4. 安装PC端管理系统依赖

```bash
cd ../client-pc
npm install 或 npm install --legacy-peer-deps
```

## 运行项目

### 1. 启动后端服务

```bash
cd backend
node server.js
```

后端服务默认运行在 `http://localhost:3000`。

### 2. 启动客户端开发服务器

```bash
cd ../client
npm run dev:weapp
```

客户端开发接口默认使用：

- 本地开发：`http://localhost:3000`（功能实现）
- 远程API：`http://123.207.32.32:1888/api`（丰富展示）。

### 3. 启动PC端管理系统开发服务器

```bash
cd ../client-pc
npm run dev
```

PC端管理系统开发服务器默认运行在 `http://localhost:3001`。

## API主要接口

- **酒店列表**：`GET /home/houselist?page=1`
- **酒店详情**：`GET /detail/infos?houseId=1`
- **用户登录**：`POST /auth/login`
- **酒店管理**：`GET /hotel/list`
- **房型管理**：`GET /roomType/list`
- **订单管理**：`GET /order/list`

## 注意事项

1. **数据库**：项目使用SQLite数据库，数据库文件为 `backend/database.db`。
2. **文件上传**：上传的文件保存在 `backend/uploads` 目录中。
3. **环境配置**：请根据实际情况修改 `client/src/services/config.ts` 中的API基础URL。
4. **权限管理**：PC端管理系统需要登录才能访问，默认管理员账号密码请联系开发人员。
5. **API调用顺序**：客户端优先调用远程API，失败后回退到本地API。
6. **房型展示**：远程API返回的数据使用随机生成的房型用于展示按价格排列，本地API返回的数据使用传过来的房型。

## 团队成员

- 陈浩南
  （商户PC端全部内容，及大部分后端内容）

1. 用户登录、注册
2. 酒店信息录入、编辑、修改
3. 酒店信息审核发布、下线
4. 实现后端中间件和接口服务

- 孙思源
  （客户端小程序全部内容，及相关后端内容）

1. 酒店查询页中各项功能，包括顶部Banner展示、跳转，及搜索栏跳转、查询、定位、筛选时间和条件等的设置和存储，手写日历组件等功能。
2. 酒店列表页的筛选头、排序栏、下拉列表、返回顶部按钮等功能。
3. 酒店详情页中根据不同接口传回内容显示酒店图片、基本信息、评分、设施、房型信息、可缩放地图、评论等内容，及基本预订和显示等功能。
4. 搜索栏页面，可供选择城市和推荐酒店、按输入和拼音拼配搜索等功能。

## 亮点

1. **多端适配**：客户端使用 Taro 框架，支持多端运行（微信小程序、H5等），实现一次开发，多端部署。

2. **前后端分离**：采用前后端完全分离架构，使用 RESTful API 进行通信，提高开发效率和系统可维护性。

3. **双API策略**：客户端优先调用远程API，失败后回退到本地API，提高系统稳定性和用户体验。

4. **智能房型生成**：远程API返回的数据使用随机生成的房型，确保展示效果丰富多样，按价格排列便于用户选择。

5. **完整的管理系统**：PC端管理系统提供完整的酒店、房型、订单管理功能，支持管理员高效管理平台。

6. **现代化技术栈**：使用 React、TypeScript、Redux Toolkit 等现代前端技术，代码质量高，可维护性强。

7. **响应式设计**：适配不同设备屏幕尺寸，提供良好的用户体验。

8. **模块化架构**：代码结构清晰，采用模块化设计，便于维护和扩展。

9. **安全性**：使用 JWT 进行身份验证，保护用户数据安全。

10. **高性能**：优化 API 调用，提高系统响应速度，确保用户操作流畅。

11. **手写日历组件**：客户端实现了手写日历组件，提供直观的日期选择功能。

12. **可缩放地图**：酒店详情页集成可缩放地图，方便用户查看酒店位置。

13. **智能筛选**：支持按价格、星级等多维度筛选酒店，提高用户搜索效率。

14. **实时订单管理**：PC端管理系统支持实时查看和处理订单，提高运营效率。

15. **文件上传功能**：支持酒店图片上传，丰富酒店信息展示。
