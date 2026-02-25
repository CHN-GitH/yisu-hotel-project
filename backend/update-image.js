const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.run('UPDATE room_types SET image = ? WHERE id = 1', ['/uploads/file-1772033079611-48969293.png'], function (err) {
  if (err) {
    console.error('数据库更新失败:', err);
  } else {
    console.log('数据库更新成功！');
  }
  db.close();
});