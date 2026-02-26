// 酒店模型
const db = require('./init');

class Hotel {
  // 创建酒店
  static create(hotelData) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO hotels (
          name, name_en, address, star_level, min_price, cover_image, 
          images, facilities, description, open_date, status, merchant_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hotelData.name,
          hotelData.name_en || '',
          hotelData.address,
          hotelData.star_level,
          hotelData.min_price,
          hotelData.cover_image || '',
          JSON.stringify(hotelData.images || []),
          JSON.stringify(hotelData.facilities || []),
          hotelData.description || '',
          hotelData.open_date || '',
          hotelData.status || 'draft',
          hotelData.merchant_id
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...hotelData });
          }
        }
      );
    });
  }

  // 根据ID查找酒店
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM hotels WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          // 解析JSON字段
          if (row.images) row.images = JSON.parse(row.images);
          if (row.facilities) row.facilities = JSON.parse(row.facilities);
          if (row.pending_data) row.pending_data = JSON.parse(row.pending_data);
          resolve(row);
        } else {
          resolve(null);
        }
      });
    });
  }

  // 获取酒店列表
  static getList(params = {}) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM hotels WHERE 1=1';
      const values = [];

      // 根据商户ID过滤
      if (params.merchant_id) {
        sql += ' AND merchant_id = ?';
        values.push(params.merchant_id);
      }

      // 根据状态过滤
      if (params.status) {
        sql += ' AND status = ?';
        values.push(params.status);
      }

      // 根据星级过滤
      if (params.star_level) {
        sql += ' AND star_level = ?';
        values.push(params.star_level);
      }

      // 排序
      sql += ' ORDER BY created_at DESC';

      db.all(sql, values, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // 解析JSON字段
          rows.forEach(row => {
            if (row.images) row.images = JSON.parse(row.images);
            if (row.facilities) row.facilities = JSON.parse(row.facilities);
          });
          resolve(rows);
        }
      });
    });
  }

  // 更新酒店
  static update(id, hotelData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (hotelData.name) {
        fields.push('name = ?');
        values.push(hotelData.name);
      }

      if (hotelData.name_en !== undefined) {
        fields.push('name_en = ?');
        values.push(hotelData.name_en);
      }

      if (hotelData.address) {
        fields.push('address = ?');
        values.push(hotelData.address);
      }

      if (hotelData.star_level) {
        fields.push('star_level = ?');
        values.push(hotelData.star_level);
      }

      if (hotelData.min_price) {
        fields.push('min_price = ?');
        values.push(hotelData.min_price);
      }

      if (hotelData.cover_image) {
        fields.push('cover_image = ?');
        values.push(hotelData.cover_image);
      }

      if (hotelData.images) {
        fields.push('images = ?');
        values.push(JSON.stringify(hotelData.images));
      }

      if (hotelData.facilities) {
        fields.push('facilities = ?');
        values.push(JSON.stringify(hotelData.facilities));
      }

      if (hotelData.description) {
        fields.push('description = ?');
        values.push(hotelData.description);
      }

      if (hotelData.open_date !== undefined) {
        fields.push('open_date = ?');
        values.push(hotelData.open_date);
      }

      if (hotelData.status) {
        fields.push('status = ?');
        values.push(hotelData.status);
      }

      if (hotelData.reject_reason !== undefined) {
        fields.push('reject_reason = ?');
        values.push(hotelData.reject_reason);
      }

      if (hotelData.original_status !== undefined) {
        fields.push('original_status = ?');
        values.push(hotelData.original_status);
      }

      if (hotelData.pending_action !== undefined) {
        fields.push('pending_action = ?');
        values.push(hotelData.pending_action);
      }

      if (hotelData.pending_data !== undefined) {
        fields.push('pending_data = ?');
        values.push(JSON.stringify(hotelData.pending_data));
      }

      if (fields.length === 0) {
        resolve({ id, ...hotelData });
        return;
      }

      values.push(id);
      const sql = `UPDATE hotels SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

      db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, ...hotelData });
        }
      });
    });
  }

  // 删除酒店
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM hotels WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ affectedRows: this.changes });
        }
      });
    });
  }

  // 搜索酒店
  static search(params = {}) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM hotels WHERE status = ?';
      const values = ['published'];

      // 根据城市搜索
      if (params.city) {
        sql += ' AND address LIKE ?';
        values.push(`%${params.city}%`);
      }

      // 根据关键词搜索
      if (params.keyword) {
        sql += ' AND (name LIKE ? OR description LIKE ?)';
        values.push(`%${params.keyword}%`, `%${params.keyword}%`);
      }

      // 根据价格范围搜索
      if (params.min_price) {
        sql += ' AND min_price >= ?';
        values.push(params.min_price);
      }

      if (params.max_price) {
        sql += ' AND min_price <= ?';
        values.push(params.max_price);
      }

      // 根据星级搜索
      if (params.star_level) {
        sql += ' AND star_level IN (' + params.star_level.map(() => '?').join(', ') + ')';
        values.push(...params.star_level);
      }

      // 排序
      sql += ' ORDER BY min_price ASC';

      // 分页
      if (params.page && params.page_size) {
        const offset = (params.page - 1) * params.page_size;
        sql += ' LIMIT ? OFFSET ?';
        values.push(params.page_size, offset);
      }

      db.all(sql, values, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // 解析JSON字段
          rows.forEach(row => {
            if (row.images) row.images = JSON.parse(row.images);
            if (row.facilities) row.facilities = JSON.parse(row.facilities);
          });
          resolve(rows);
        }
      });
    });
  }

  // 获取热门酒店
  static getHotHotels(limit = 10) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM hotels WHERE status = ? ORDER BY created_at DESC LIMIT ?';
      db.all(sql, ['published', limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // 解析JSON字段
          rows.forEach(row => {
            if (row.images) row.images = JSON.parse(row.images);
            if (row.facilities) row.facilities = JSON.parse(row.facilities);
          });
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Hotel;