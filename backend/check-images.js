const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.get('SELECT id, name, image, images FROM room_types WHERE id = 1', function(err, row) {
  if (err) {
    console.error('查询失败:', err);
  } else {
    console.log('房型信息:', row);
    // 解析 images 字段
    if (row.images) {
      try {
        const images = JSON.parse(row.images);
        console.log('解析后的 images 字段:', images);
      } catch (e) {
        console.error('解析 images 字段失败:', e);
      }
    }
  }
  db.close();
});