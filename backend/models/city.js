// 城市模型
const db = require('./init');

class City {
  // 获取所有城市
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM cities ORDER BY is_hot DESC, name ASC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 获取热门城市
  static getHotCities() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM cities WHERE is_hot = 1 ORDER BY name ASC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 根据名称查找城市
  static findByName(name) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM cities WHERE name = ?', [name], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = City;
