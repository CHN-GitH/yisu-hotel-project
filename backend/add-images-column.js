const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.run('ALTER TABLE room_types ADD COLUMN images TEXT', function(err) {
  if (err) {
    console.error('添加字段失败:', err);
  } else {
    console.log('添加字段成功！');
    // 将现有的 image 字段的值转换为 images 字段的值
    db.run('UPDATE room_types SET images = json_array(image) WHERE image IS NOT NULL', function(err) {
      if (err) {
        console.error('更新字段失败:', err);
      } else {
        console.log('更新字段成功！');
      }
      db.close();
    });
  }
});