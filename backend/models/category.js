// 分类模型
const db = require('./init');

class Category {
  // 获取所有分类
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories ORDER BY id ASC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Category;
