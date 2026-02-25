// 数据库初始化脚本
const sqlite3 = require('sqlite3').verbose();
const config = require('../config');
const bcrypt = require('bcrypt');

// 创建数据库连接
const db = new sqlite3.Database(config.database.file, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功');
    initDatabase();
  }
});

// 初始化数据库
function initDatabase() {
  // 创建用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'merchant',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('创建用户表失败:', err.message);
    } else {
      console.log('用户表创建成功');
      initUsers();
    }
  });

  // 创建酒店表
  db.run(`
    CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_en TEXT,
      address TEXT NOT NULL,
      star_level INTEGER NOT NULL,
      min_price INTEGER NOT NULL,
      cover_image TEXT,
      images TEXT,
      facilities TEXT,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      merchant_id INTEGER NOT NULL,
      reject_reason TEXT,
      original_status TEXT,
      pending_action TEXT,
      pending_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (merchant_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建酒店表失败:', err.message);
    } else {
      console.log('酒店表创建成功');
    }
  });

  // 创建房型表
  db.run(`
    CREATE TABLE IF NOT EXISTS room_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hotel_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      bed_type TEXT NOT NULL,
      area INTEGER NOT NULL,
      capacity INTEGER NOT NULL,
      price INTEGER NOT NULL,
      breakfast INTEGER NOT NULL DEFAULT 0,
      cancel_policy TEXT,
      image TEXT,
      facilities TEXT DEFAULT '[]',
      floor INTEGER,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hotel_id) REFERENCES hotels(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建房型表失败:', err.message);
    } else {
      console.log('房型表创建成功');
    }
  });

  // 创建城市表
  db.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      pinyin TEXT,
      level TEXT NOT NULL,
      parent_id INTEGER,
      is_hot INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (parent_id) REFERENCES cities(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建城市表失败:', err.message);
    } else {
      console.log('城市表创建成功');
      initCities();
    }
  });

  // 创建分类表
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      desc TEXT,
      parent_id INTEGER,
      FOREIGN KEY (parent_id) REFERENCES categories(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建分类表失败:', err.message);
    } else {
      console.log('分类表创建成功');
      initCategories();
    }
  });

  // 创建热门推荐表
  db.run(`
    CREATE TABLE IF NOT EXISTS hot_suggests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image TEXT,
      desc TEXT,
      link TEXT,
      hot_value INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('创建热门推荐表失败:', err.message);
    } else {
      console.log('热门推荐表创建成功');
      initHotSuggests();
    }
  });

  // 创建订单表
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      hotel_id INTEGER NOT NULL,
      room_type_id INTEGER NOT NULL,
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      guests INTEGER NOT NULL,
      total_price INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (hotel_id) REFERENCES hotels(id),
      FOREIGN KEY (room_type_id) REFERENCES room_types(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建订单表失败:', err.message);
    } else {
      console.log('订单表创建成功');
    }
  });
}

// 初始化用户数据
function initUsers() {
  // 检查是否已有用户数据
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) {
      console.error('检查用户数据失败:', err.message);
    } else if (row.count === 0) {
      // 初始化默认用户
      const users = [
        {
          username: 'admin1',
          password: '123456',
          name: '陈审核员',
          role: 'admin'
        },
        {
          username: 'merchant1',
          password: '123456',
          name: '孙老板',
          role: 'merchant'
        }
      ];

      users.forEach(user => {
        bcrypt.hash(user.password, 10, (err, hash) => {
          if (err) {
            console.error('密码加密失败:', err.message);
          } else {
            db.run(
              'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
              [user.username, hash, user.name, user.role],
              (err) => {
                if (err) {
                  console.error('创建用户失败:', err.message);
                } else {
                  console.log(`用户 ${user.username} 创建成功`);
                }
              }
            );
          }
        });
      });
    }
  });
}

// 初始化城市数据
function initCities() {
  // 检查是否已有城市数据
  db.get('SELECT COUNT(*) as count FROM cities', (err, row) => {
    if (err) {
      console.error('检查城市数据失败:', err.message);
    } else if (row.count === 0) {
      // 初始化热门城市
      const cities = [
        { name: '北京', pinyin: 'beijing', level: 'city', is_hot: 1 },
        { name: '上海', pinyin: 'shanghai', level: 'city', is_hot: 1 },
        { name: '广州', pinyin: 'guangzhou', level: 'city', is_hot: 1 },
        { name: '深圳', pinyin: 'shenzhen', level: 'city', is_hot: 1 },
        { name: '杭州', pinyin: 'hangzhou', level: 'city', is_hot: 1 },
        { name: '成都', pinyin: 'chengdu', level: 'city', is_hot: 1 },
        { name: '武汉', pinyin: 'wuhan', level: 'city', is_hot: 1 },
        { name: '西安', pinyin: 'xian', level: 'city', is_hot: 1 }
      ];

      cities.forEach(city => {
        db.run(
          'INSERT INTO cities (name, pinyin, level, is_hot) VALUES (?, ?, ?, ?)',
          [city.name, city.pinyin, city.level, city.is_hot],
          (err) => {
            if (err) {
              console.error('创建城市失败:', err.message);
            }
          }
        );
      });
      console.log('城市数据初始化成功');
    }
  });
}

// 初始化分类数据
function initCategories() {
  // 检查是否已有分类数据
  db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
    if (err) {
      console.error('检查分类数据失败:', err.message);
    } else if (row.count === 0) {
      // 初始化分类
      const categories = [
        { name: '豪华酒店', icon: 'luxury', desc: '五星级及以上酒店' },
        { name: '商务酒店', icon: 'business', desc: '适合商务出行' },
        { name: '度假酒店', icon: 'resort', desc: '适合休闲度假' },
        { name: '快捷酒店', icon: 'budget', desc: '经济实惠' }
      ];

      categories.forEach(category => {
        db.run(
          'INSERT INTO categories (name, icon, desc) VALUES (?, ?, ?)',
          [category.name, category.icon, category.desc],
          (err) => {
            if (err) {
              console.error('创建分类失败:', err.message);
            }
          }
        );
      });
      console.log('分类数据初始化成功');
    }
  });
}

// 初始化热门推荐数据
function initHotSuggests() {
  // 检查是否已有热门推荐数据
  db.get('SELECT COUNT(*) as count FROM hot_suggests', (err, row) => {
    if (err) {
      console.error('检查热门推荐数据失败:', err.message);
    } else if (row.count === 0) {
      // 初始化热门推荐
      const hotSuggests = [
        {
          title: '春节特惠',
          image: 'https://via.placeholder.com/400x200/1890ff/ffffff?text=春节特惠',
          desc: '春节期间入住享8折优惠',
          link: '/search?promotion=spring',
          hot_value: 100
        },
        {
          title: '商务出行',
          image: 'https://via.placeholder.com/400x200/52c41a/ffffff?text=商务出行',
          desc: '商务酒店专享优惠',
          link: '/search?category=business',
          hot_value: 90
        },
        {
          title: '度假休闲',
          image: 'https://via.placeholder.com/400x200/fa8c16/ffffff?text=度假休闲',
          desc: '度假酒店推荐',
          link: '/search?category=resort',
          hot_value: 80
        }
      ];

      hotSuggests.forEach(suggest => {
        db.run(
          'INSERT INTO hot_suggests (title, image, desc, link, hot_value) VALUES (?, ?, ?, ?, ?)',
          [suggest.title, suggest.image, suggest.desc, suggest.link, suggest.hot_value],
          (err) => {
            if (err) {
              console.error('创建热门推荐失败:', err.message);
            }
          }
        );
      });
      console.log('热门推荐数据初始化成功');
    }
  });
}

module.exports = db;
