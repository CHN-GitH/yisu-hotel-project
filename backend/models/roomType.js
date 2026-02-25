// 房型模型
const db = require('./init');

class RoomType {
  // 创建房型
  static create(roomTypeData) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO room_types (
          hotel_id, name, bed_type, area, capacity, price, 
          breakfast, cancel_policy, image, images, facilities, floor, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          roomTypeData.hotel_id,
          roomTypeData.name,
          roomTypeData.bed_type,
          roomTypeData.area,
          roomTypeData.capacity,
          roomTypeData.price,
          roomTypeData.breakfast ? 1 : 0,
          roomTypeData.cancel_policy || '',
          roomTypeData.images && roomTypeData.images.length > 0 ? roomTypeData.images[0] : '',
          JSON.stringify(roomTypeData.images || []),
          JSON.stringify(roomTypeData.facilities || []),
          roomTypeData.floor || null,
          roomTypeData.description || ''
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...roomTypeData });
          }
        }
      );
    });
  }

  // 根据ID查找房型
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM room_types WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            // 解析JSON字段
            if (row.facilities) row.facilities = JSON.parse(row.facilities);
            if (row.images) row.images = JSON.parse(row.images);
          }
          resolve(row);
        }
      });
    });
  }

  // 根据酒店ID获取房型列表
  static getByHotelId(hotelId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM room_types WHERE hotel_id = ?', [hotelId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // 解析JSON字段
          rows.forEach(row => {
            if (row.facilities) row.facilities = JSON.parse(row.facilities);
            if (row.images) row.images = JSON.parse(row.images);
          });
          resolve(rows);
        }
      });
    });
  }

  // 更新房型
  static update(id, roomTypeData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (roomTypeData.name) {
        fields.push('name = ?');
        values.push(roomTypeData.name);
      }

      if (roomTypeData.bed_type) {
        fields.push('bed_type = ?');
        values.push(roomTypeData.bed_type);
      }

      if (roomTypeData.area) {
        fields.push('area = ?');
        values.push(roomTypeData.area);
      }

      if (roomTypeData.capacity) {
        fields.push('capacity = ?');
        values.push(roomTypeData.capacity);
      }

      if (roomTypeData.price) {
        fields.push('price = ?');
        values.push(roomTypeData.price);
      }

      if (roomTypeData.breakfast !== undefined) {
        fields.push('breakfast = ?');
        values.push(roomTypeData.breakfast ? 1 : 0);
      }

      if (roomTypeData.cancel_policy !== undefined) {
        fields.push('cancel_policy = ?');
        values.push(roomTypeData.cancel_policy);
      }

      if (roomTypeData.images !== undefined) {
        fields.push('images = ?');
        values.push(JSON.stringify(roomTypeData.images || []));
        // 同时更新 image 字段，保持向后兼容
        if (roomTypeData.images && roomTypeData.images.length > 0) {
          fields.push('image = ?');
          values.push(roomTypeData.images[0]);
        } else {
          fields.push('image = ?');
          values.push('');
        }
      }

      if (roomTypeData.facilities !== undefined) {
        fields.push('facilities = ?');
        values.push(JSON.stringify(roomTypeData.facilities || []));
      }

      if (roomTypeData.floor !== undefined) {
        fields.push('floor = ?');
        values.push(roomTypeData.floor);
      }

      if (roomTypeData.description !== undefined) {
        fields.push('description = ?');
        values.push(roomTypeData.description);
      }

      if (fields.length === 0) {
        resolve({});
        return;
      }

      values.push(id);
      const sql = `UPDATE room_types SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

      db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, ...roomTypeData });
        }
      });
    });
  }

  // 删除房型
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM room_types WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ affectedRows: this.changes });
        }
      });
    });
  }
}

module.exports = RoomType;
