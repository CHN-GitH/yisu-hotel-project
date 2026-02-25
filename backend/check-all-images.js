const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.all('SELECT id, name, image, images FROM room_types', function(err, rows) {
  if (err) {
    console.error('查询失败:', err);
  } else {
    console.log('房型信息:');
    rows.forEach(row => {
      console.log('ID:', row.id);
      console.log('名称:', row.name);
      console.log('image 字段:', row.image);
      console.log('images 字段:', row.images);
      // 解析 images 字段
      if (row.images) {
        try {
          const images = JSON.parse(row.images);
          console.log('解析后的 images 字段:', images);
        } catch (e) {
          console.error('解析 images 字段失败:', e);
        }
      }
      console.log('---');
    });
  }
  db.close();
});