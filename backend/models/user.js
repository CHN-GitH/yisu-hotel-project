// 用户模型
const db = require('./init');
const bcrypt = require('bcrypt');

class User {
  // 根据用户名查找用户
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 根据ID查找用户
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 创建用户
  static create(userData) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(userData.password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          db.run(
            'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
            [userData.username, hash, userData.name, userData.role || 'merchant'],
            function(err) {
              if (err) {
                reject(err);
              } else {
                resolve({ id: this.lastID, ...userData, password: hash });
              }
            }
          );
        }
      });
    });
  }

  // 更新用户信息
  static update(id, userData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (userData.name) {
        fields.push('name = ?');
        values.push(userData.name);
      }

      if (userData.password) {
        bcrypt.hash(userData.password, 10, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            fields.push('password = ?');
            values.push(hash);
            values.push(id);

            const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
            db.run(sql, values, function(err) {
              if (err) {
                reject(err);
              } else {
                resolve({ id, ...userData });
              }
            });
          }
        });
      } else {
        values.push(id);
        const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        db.run(sql, values, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, ...userData });
          }
        });
      }
    });
  }

  // 获取所有用户
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 获取所有商户
  static getMerchants() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users WHERE role = ?', ['merchant'], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 删除用户
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ affectedRows: this.changes });
        }
      });
    });
  }
}

module.exports = User;
