// 订单模型
const db = require('./init');

class Order {
  // 创建订单
  static create(orderData) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO orders (
          user_id, hotel_id, room_type_id, check_in, check_out, 
          guests, total_price, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderData.user_id,
          orderData.hotel_id,
          orderData.room_type_id,
          orderData.check_in,
          orderData.check_out,
          orderData.guests,
          orderData.total_price,
          orderData.status || 'pending'
        ],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...orderData });
          }
        }
      );
    });
  }

  // 根据ID查找订单
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 根据用户ID获取订单列表
  static getByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 更新订单状态
  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, status });
          }
        }
      );
    });
  }
}

module.exports = Order;
