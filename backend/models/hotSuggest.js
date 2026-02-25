// 热门推荐模型
const db = require('./init');

class HotSuggest {
  // 获取所有热门推荐
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM hot_suggests ORDER BY hot_value DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = HotSuggest;
