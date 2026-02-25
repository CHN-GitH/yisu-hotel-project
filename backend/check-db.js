const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT id, name, image FROM room_types LIMIT 5', (err, rows) => {
  if (err) {
    console.error('查询失败:', err);
  } else {
    console.log('房型图片路径：');
    console.log(JSON.stringify(rows, null, 2));
  }
  db.close();
});
